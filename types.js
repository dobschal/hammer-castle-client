/**
 * @typedef Castle
 * @type object
 * @property {string} color - "#f54b42"
 * @property {boolean} hasKnight - false
 * @property {boolean} isInConquer - false
 * @property {string} name - "Wyvern"
 * @property {number} points - 3
 * @property {string} timestamp - "2020-10-22 05:32:44"
 * @property {number} userId - 3
 * @property {string} username - "sascha"
 * @property {number} x - 1795.3519999999955
 * @property {number} y - 397.64499999999936
 */

/**
 * @typedef Knight
 * @type object
 * @property {number} arrivesAt
 * @property {string} color - "#b03330"
 * @property {number} goToX - null
 * @property {number} goToY - null
 * @property {number} id - 2
 * @property {number} level - 1
 * @property {string} name - "Sir Friedbert"
 * @property {number} userId - 2
 * @property {string} username - "sascha"
 * @property {number} x - 2953.1139999999973
 * @property {number} y - 1398.2489999999984
 */

/**
 * @typedef Position
 * @type object
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef Friend
 * @type object
 * @property {string} username
 * @property {number} id
 * @property {number} level
 * @property {number} lastActiveAt
 */

/**
 * @typedef ActionLog
 * @type object
 * @property {string} content - "You build a knight."
 * @property {number} id - 92
 * @property {number} timestamp - 1604776136996
 * @property {number} userId - 3
 * @property {number} x - 12.5
 * @property {number} y - 3.555
 * @property {string} type - "UNKNOWN"
 */

/**
 * @typedef Quest
 * @type {object}
 * @property {number} id
 * @property {number} prevQuestId
 * @property {number} isRecurring
 * @property {string} recurringInterval
 * @property {string} titleKey
 * @property {string} messageKey
 * @property {string} imageName
 * @property {string} benefitType
 * @property {number} benefitValue
 */

/**
 * @typedef BeerStats
 * @type object
 * @property {number} beerCostsPerMinute - 24
 * @property {number} beerPerMinute - 51
 * @property {number} maxBeer - 500
 */

export default {};
