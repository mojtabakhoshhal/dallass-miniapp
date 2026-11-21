'use strict';
/* DallasPricing — display-layer safety rules for the mini-app feed.
 *
 * The bot is the only source of truth at order time; this module only
 * decides what the page may DISPLAY. Rules (conservative by design):
 *  1. A discount is shown only when ALL hold: the feed marks the campaign
 *     active, the viewer's clock is still inside the campaign window
 *     (campaign.until, end of day), and the feed is fresh.
 *  2. A stale feed (older than STALE_MS) never shows a discount and must
 *     carry a visible staleness warning with the feed's source time.
 *  3. After the campaign window, plain sell prices are shown even if the
 *     feed still contains campaign finals.
 *  4. An invalid feed is rejected whole — no partial or zero prices.
 *  5. The campaign end is compared as an absolute instant (until_ts,
 *     stamped by the generator on the bot's host), so the viewer's
 *     timezone cannot shift the boundary. A viewer clock far behind
 *     makes the feed look future-dated and trips rule 6; a clock far
 *     ahead trips the window check or rule 2 — every failure mode is
 *     conservative (discount hidden), never generous.
 *  6. A feed dated in the future (beyond 5 min) means one of the clocks
 *     is wrong: the discount is suppressed and a skew warning is shown.
 * Pure functions, no DOM: loadable in the browser and in Node tests.
 */
(function (root) {
  var STALE_MS = 26 * 3600 * 1000; // daily sync cadence (24h) + 2h slack

  function feedTimeMs(feed) {
    if (!feed) return NaN;
    if (typeof feed.generated_ts === 'number' && feed.generated_ts > 0) {
      return feed.generated_ts * 1000;
    }
    var t = Date.parse(feed.generated_at || '');
    return isNaN(t) ? NaN : t;
  }

  function validateFeed(feed) {
    if (!feed || typeof feed !== 'object') return 'feed-not-object';
    if (!Array.isArray(feed.products) || feed.products.length === 0) return 'products-missing';
    for (var i = 0; i < feed.products.length; i++) {
      var p = feed.products[i];
      if (!p || typeof p.id !== 'string' || !Array.isArray(p.plans)) return 'product-schema-' + i;
      for (var j = 0; j < p.plans.length; j++) {
        var pl = p.plans[j];
        if (typeof pl.price !== 'number' || typeof pl.final !== 'number') return 'plan-schema-' + i + '-' + j;
      }
    }
    if (isNaN(feedTimeMs(feed))) return 'timestamp-missing';
    return null;
  }

  var SKEW_MS = 5 * 60 * 1000; // feed "from the future" beyond this = clock skew

  function assess(feed, nowMs) {
    var err = validateFeed(feed);
    if (err) return { ok: false, error: err };
    var genMs = feedTimeMs(feed);
    var ageMs = nowMs - genMs;
    var stale = ageMs > STALE_MS;
    var skew = ageMs < -SKEW_MS;
    var camp = feed.campaign || {};
    // Prefer the absolute expiry instant stamped by the generator on the
    // bot's own host (immune to the viewer's timezone); fall back to
    // parsing the date in the viewer's local time for older feeds.
    var untilMs = (typeof camp.until_ts === 'number' && camp.until_ts > 0)
      ? camp.until_ts * 1000
      : (camp.until ? Date.parse(camp.until + 'T23:59:59') : NaN);
    var withinWindow = !isNaN(untilMs) && nowMs <= untilMs;
    return {
      ok: true,
      stale: stale,
      skew: skew,
      ageMs: ageMs,
      generatedMs: genMs,
      campaignLive: !!(camp.active && withinWindow && !stale && !skew),
      campaignEnded: !!(camp.active && !withinWindow),
      offPct: camp.off_pct || 0,
      untilFa: camp.until_fa || ''
    };
  }

  function displayPrice(plan, assessment) {
    if (!plan || !plan.available) return null;
    return assessment.campaignLive ? plan.final : plan.price;
  }

  function fromPrice(product, assessment) {
    var best = null;
    for (var i = 0; i < product.plans.length; i++) {
      var v = displayPrice(product.plans[i], assessment);
      if (v !== null && (best === null || v < best)) best = v;
    }
    return best;
  }

  root.DallasPricing = {
    STALE_MS: STALE_MS,
    validateFeed: validateFeed,
    assess: assess,
    displayPrice: displayPrice,
    fromPrice: fromPrice
  };
})(typeof window !== 'undefined' ? window : globalThis);
