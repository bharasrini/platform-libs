// This module provides functions to convert between Freshdesk timezone labels and IANA timezone identifiers.

const { formatInTimeZone } = require("date-fns-tz");
const common = require("@fyle-ops/common");


// Importing the Freshdesk timezone mapping from fd_timezones.json
const FRESHDESK_TO_IANA_TZ = require("../data/fd_timezones.json");

// Construct a reverse mapping from IANA timezone identifiers to Freshdesk timezone labels
const IANA_TO_FRESHDESK_TZ = {};

for (const [label, iana] of Object.entries(FRESHDESK_TO_IANA_TZ)) 
{
    if (!IANA_TO_FRESHDESK_TZ[iana])
    {
        IANA_TO_FRESHDESK_TZ[iana] = [];
    }
    IANA_TO_FRESHDESK_TZ[iana].push(label);
}

// Function to convert Freshdesk timezone label to IANA timezone identifier
function freshdeskToIana(label)
{
    if (!label) return null;
    return FRESHDESK_TO_IANA_TZ[String(label).trim()] || null;
}

// Function to convert IANA timezone identifier to Freshdesk timezone label(s)
function ianaToFreshdesk(ianaId, { all = false } = {})
{
    if (!ianaId) return null;
    const list = IANA_TO_FRESHDESK_TZ[String(ianaId).trim()] || null;
    if (!list) return null;
    return all ? list : list[0]; // first label as canonical
}

// Functions to get the Freshdesk to IANA mappings
function getFreshdeskMap()
{
    return FRESHDESK_TO_IANA_TZ;
}

// Functions to get the IANA to Freshdesk mappings
function getIanaMap()
{
    return IANA_TO_FRESHDESK_TZ;
}


// Convert a time string in Freshdesk timezone to UTC
function convertTimeToUTC(timeStr, fdLabel, dateStr) 
{
    const tz = FRESHDESK_TO_IANA_TZ[fdLabel];
    if (!tz) throw new Error("Unknown Freshdesk timezone: " + fdLabel);
    if (!dateStr) throw new Error("dateStr is required (DST differs by date)");

    // Parse "hh:mm[:ss] AM/PM"
    const m = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!m) throw new Error("Invalid 12-hour time: " + timeStr);
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const sec = parseInt(m[3] || "0", 10);
    const ampm = m[4].toUpperCase();

    // Convert to 24h
    if (ampm === "AM" && h === 12) h = 0;         // 12 AM -> 00
    if (ampm === "PM" && h < 12) h += 12;         // 1..11 PM -> 13..23

    // Desired local minutes since midnight
    const desiredMinutes = h * 60 + min;

    // Parse date components
    const [Y, M, D] = dateStr.split("-").map(Number);

    // Step 1: Start with a UTC guess that has the same clock components
    let utcGuess = Date.UTC(Y, M - 1, D, h, min, sec);

    // Step 2: See what LOCAL time that guess produces in the target zone
    let localStr = formatInTimeZone(new Date(utcGuess), tz, "yyyy-MM-dd HH:mm:ss");
    let [, ly, lM, lD, lhh, lmm, lss] = localStr.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/).map(Number);
    let localMinutes = lhh * 60 + lmm;

    // Difference between desired local time and produced local time (in minutes)
    let deltaMin = desiredMinutes - localMinutes;

    // Adjust UTC guess by that difference
    utcGuess += deltaMin * 60 * 1000;

    // (Optional) One more pass for safety (handles rare DST boundary effects)
    localStr = formatInTimeZone(new Date(utcGuess), tz, "yyyy-MM-dd HH:mm:ss");
    [, ly, lM, lD, lhh, lmm, lss] = localStr.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/).map(Number);
    localMinutes = lhh * 60 + lmm;
    deltaMin = desiredMinutes - localMinutes;
    if (deltaMin !== 0) {
      utcGuess += deltaMin * 60 * 1000;
    }

    // Final UTC
    return formatInTimeZone(new Date(utcGuess), "UTC", "yyyy-MM-dd HH:mm:ss");
}


// Exporting the functions
module.exports =
{
    freshdeskToIana,
    ianaToFreshdesk,
    getFreshdeskMap,
    getIanaMap,
    convertTimeToUTC,
};