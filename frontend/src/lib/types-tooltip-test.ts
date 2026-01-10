/**
 * @file IDE Tooltip Verification Test
 *
 * This file imports and uses types from types.ts to verify that JSDoc documentation
 * appears correctly in IDE tooltips when hovering over type references.
 *
 * ## How to Verify:
 * 1. Open this file in your IDE (VS Code, WebStorm, etc.)
 * 2. Hover over any type name (e.g., `Settings`, `EnrichedTask`, `WeatherData`)
 * 3. Verify the JSDoc tooltip appears with:
 *    - Complete description
 *    - Property documentation
 *    - Links and @see references
 *    - Code examples
 * 4. Hover over property names to see property-level documentation
 * 5. Click @see links to navigate to referenced files
 *
 * ## Types to Test:
 * - Theme Types: ThemeColors, Theme, ThemeMap
 * - Settings Types: Settings, TimeFormat, DateFormat, etc.
 * - Link Types: Link
 * - Task Types: RawTask, EnrichedTask, TaskDue
 * - Calendar Types: GoogleCalendar, CalendarEvent
 * - Weather Types: CurrentWeatherRaw, ProcessedCurrentWeather, WeatherData
 * - Unsplash Types: UnsplashPhotographer, UnsplashBackground
 * - Date Matcher Types: ParsedDate, DateCandidate
 * - Provider Config Types: TaskProviderConfig, CalendarProviderConfig
 *
 * @note This file is for manual IDE testing only and should not be imported in production code
 */

import type {
    // Theme types
    ThemeColors,
    Theme,
    ThemeMap,

    // Link types
    Link,

    // Settings types
    Settings,
    TimeFormat,
    DateFormat,
    TempUnit,
    SpeedUnit,
    TaskProviderType,
    LinkTarget,
    LocationMode,

    // Task types
    TaskDue,
    RawTask,
    EnrichedTask,
    TaskProviderConfig,

    // Calendar types
    GoogleCalendar,
    CalendarEvent,
    CalendarProviderConfig,

    // Weather types (Raw)
    CurrentWeatherRaw,
    HourlyWeatherRaw,
    WeatherApiResponse,

    // Weather types (Processed)
    ProcessedCurrentWeather,
    ForecastItem,
    WeatherData,
    WeatherCacheData,

    // Unsplash types
    UnsplashPhotographer,
    UnsplashBackground,

    // Date matcher types
    DateMatchPosition,
    TimeMatch,
    DateCandidate,
    ParsedDate,
    FormatOptions,
} from './types'

// ============================================================================
// THEME TYPES VERIFICATION
// ============================================================================

/**
 * Hover over `ThemeColors` below to see:
 * - CSS custom property documentation
 * - Background colors hierarchy (darkest to lightest)
 * - Text colors hierarchy (most to least prominent)
 * - Code example with sample theme
 */
const testThemeColors: ThemeColors = {
    '--bg-1': '#191724',
    '--bg-2': '#1f1d2e',
    '--bg-3': '#26233a',
    '--txt-1': '#e0def4',
    '--txt-2': '#c4a7e7',
    '--txt-3': '#31748f',
    '--txt-4': '#ebbcba',
    '--txt-err': '#eb6f92',
}

/**
 * Hover over `Theme` below to see:
 * - Complete theme definition with display name and color palette
 * - Cross-references to ThemeColors and themes.ts
 */
const testTheme: Theme = {
    displayName: 'Test Theme',
    colors: testThemeColors,
}

/**
 * Hover over `ThemeMap` below to see:
 * - How themes are stored and keyed by identifier
 * - Relationship between identifier and displayName
 * - Usage in settings.currentTheme
 */
const testThemeMap: ThemeMap = {
    'test-theme': testTheme,
}

// ============================================================================
// SETTINGS TYPES VERIFICATION
// ============================================================================

/**
 * Hover over `TimeFormat` to see valid values: '12hr' | '24hr'
 */
const testTimeFormat: TimeFormat = '12hr'

/**
 * Hover over `DateFormat` to see valid values: 'mdy' | 'dmy'
 */
const testDateFormat: DateFormat = 'mdy'

/**
 * Hover over `Settings` below to see:
 * - Complete settings interface documentation
 * - All properties organized into groups (Display, Clock, Weather, Tasks, etc.)
 * - Integration settings (tokens, auth) clearly marked
 * - Cross-references to components and usage
 */
const testSettings: Settings = {
    // Display settings
    font: 'monospace',
    currentTheme: 'rose-pine',
    tabTitle: 're-start',
    customCSS: '',

    // Integrations
    todoistApiToken: null,
    googleTasksSignedIn: false,

    // Clock settings
    timeFormat: '12hr',
    dateFormat: 'mdy',

    // Weather settings
    showWeather: true,
    locationMode: 'auto',
    latitude: null,
    longitude: null,
    tempUnit: 'fahrenheit',
    speedUnit: 'mph',

    // Tasks settings
    showTasks: true,
    taskBackend: 'local',

    // Calendar settings
    showCalendar: false,
    selectedCalendars: [],

    // Background settings
    showBackground: false,
    backgroundOpacity: 0.3,

    // Links settings
    showLinks: true,
    linksPerColumn: 5,
    linkTarget: '_self',
    links: [],
}

/**
 * Hover over `Link` below to see:
 * - Quick link definition documentation
 * - Layout and display information
 * - User customization features (drag-and-drop)
 * - Cross-references to Links.svelte and Settings.svelte
 */
const testLink: Link = {
    title: 'GitHub',
    url: 'https://github.com',
}

// ============================================================================
// TASK TYPES VERIFICATION
// ============================================================================

/**
 * Hover over `TaskDue` below to see:
 * - ISO 8601 date format documentation
 * - Two variants: date-only vs date-with-time
 * - How format determines has_time property
 */
const testTaskDue: TaskDue = {
    date: '2024-12-25T10:00:00',
}

/**
 * Hover over `RawTask` below to see:
 * - Base task structure from all providers
 * - Raw vs Enriched Pattern section
 * - Benefits of separation
 * - Storage format with IDs
 * - Code example
 */
const testRawTask: RawTask = {
    id: 'task-123',
    content: 'Complete documentation',
    completed: false,
    order: 1,
    project_id: 'project-456',
    labels: ['label-789'],
    due: testTaskDue,
}

/**
 * Hover over `EnrichedTask` below to see:
 * - UI-ready task with computed properties
 * - Enrichment Process section (4 steps)
 * - When to Use section
 * - Computed Properties section
 * - Sorting and Filtering section
 * - Code example showing transformation
 */
const testEnrichedTask: EnrichedTask = {
    ...testRawTask,
    project_name: 'Work',
    label_names: ['documentation'],
    due_date: new Date('2024-12-25T10:00:00'),
    has_time: true,
}

/**
 * Hover over `TaskProviderConfig` below to see:
 * - Configuration options for task providers
 * - Supported Providers section (LocalStorage, Todoist, Google Tasks)
 * - Factory Usage examples
 * - Settings Integration
 * - Future Extensibility
 */
const testTaskProviderConfig: TaskProviderConfig = {
    apiToken: 'todoist-api-token-here',
}

// ============================================================================
// CALENDAR TYPES VERIFICATION
// ============================================================================

/**
 * Hover over `GoogleCalendar` below to see:
 * - Google Calendar metadata documentation
 * - Usage in Settings for multi-calendar selection
 * - Cross-references to GoogleCalendarProvider and Calendar.svelte
 */
const testGoogleCalendar: GoogleCalendar = {
    id: 'primary',
    name: 'Personal',
    color: '#3b82f6',
    primary: true,
}

/**
 * Hover over `CalendarEvent` below to see:
 * - Processed calendar event ready for UI display
 * - Event Properties, Time Properties, Computed Display Properties sections
 * - Calendar Metadata section
 * - Event Sorting section
 * - API Integration section (Google Calendar API v3)
 */
const testCalendarEvent: CalendarEvent = {
    id: 'event-123',
    title: 'Team Meeting',
    description: 'Weekly sync',
    startTime: new Date('2024-12-25T10:00:00'),
    endTime: new Date('2024-12-25T11:00:00'),
    location: 'Conference Room A',
    hangoutLink: null,
    htmlLink: 'https://calendar.google.com/event?eid=event-123',
    isAllDay: false,
    isPast: false,
    isOngoing: false,
    calendarName: 'Work',
    calendarColor: '#3b82f6',
}

// ============================================================================
// WEATHER TYPES VERIFICATION (RAW)
// ============================================================================

/**
 * Hover over `CurrentWeatherRaw` below to see:
 * - Raw current weather data from OpenMeteo API
 * - API Source section with link to documentation
 * - Raw vs Processed Pattern section
 * - All properties with units and ranges
 * - Caching section (15-minute TTL)
 * - Transformation example
 */
const testCurrentWeatherRaw: CurrentWeatherRaw = {
    temperature_2m: 23,
    apparent_temperature: 21,
    relative_humidity_2m: 65,
    precipitation_probability: 20,
    weather_code: 1,
    wind_speed_10m: 12,
    is_day: 1,
    time: '2024-12-25T10:00',
}

/**
 * Hover over `HourlyWeatherRaw` below to see:
 * - Raw hourly weather forecast data from OpenMeteo API
 * - Array Structure section (parallel arrays explanation)
 * - Processing section (5 forecasts at 3-hour intervals)
 * - All properties documented
 */
const testHourlyWeatherRaw: HourlyWeatherRaw = {
    time: [
        '2024-12-25T00:00',
        '2024-12-25T01:00',
        '2024-12-25T02:00',
    ],
    temperature_2m: [20, 19, 18],
    weather_code: [1, 1, 2],
    is_day: [0, 0, 0],
}

/**
 * Hover over `WeatherApiResponse` below to see:
 * - Complete weather API response from OpenMeteo
 * - API Endpoint section with exact URL
 * - Request Parameters section
 * - Data Flow section (4 steps)
 * - Caching Strategy section
 */
const testWeatherApiResponse: WeatherApiResponse = {
    current: testCurrentWeatherRaw,
    hourly: testHourlyWeatherRaw,
}

// ============================================================================
// WEATHER TYPES VERIFICATION (PROCESSED)
// ============================================================================

/**
 * Hover over `ProcessedCurrentWeather` below to see:
 * - Processed current weather data ready for UI display
 * - Raw vs Processed Pattern section
 * - Transformation Process section (4 steps)
 * - All properties with original vs transformed format
 * - Before/after transformation example
 */
const testProcessedCurrentWeather: ProcessedCurrentWeather = {
    temperature_2m: '23',
    apparent_temperature: '21',
    relative_humidity_2m: 65,
    precipitation_probability: 20,
    description: 'Partly Cloudy',
    weather_code: 1,
    wind_speed_10m: '12',
    is_day: 1,
    time: '2024-12-25T10:00',
}

/**
 * Hover over `ForecastItem` below to see:
 * - Single forecast entry in hourly weather forecast
 * - Forecast Display Pattern section (5 forecasts at 3-hour intervals)
 * - Data Source section (extraction algorithm)
 * - All properties with format and transformation details
 * - Transformation example
 */
const testForecastItem: ForecastItem = {
    time: '2024-12-25T13:00',
    temperature: '24',
    weatherCode: 1,
    description: 'Partly Cloudy',
    formattedTime: '1:00 PM',
}

/**
 * Hover over `WeatherData` below to see:
 * - Complete weather data structure combining current + forecast
 * - Data Flow section (4 steps)
 * - Caching Strategy section
 * - Processing section
 * - Usage section
 */
const testWeatherData: WeatherData = {
    current: testProcessedCurrentWeather,
    forecast: [testForecastItem],
}

/**
 * Hover over `WeatherCacheData` below to see:
 * - localStorage cache structure for weather data
 * - Cache Storage section
 * - Cache Invalidation Triggers section (4 triggers)
 * - Why Cache Raw Data section (benefits)
 * - All properties documented
 * - Cache Lifecycle section (5 steps)
 * - Examples (fresh cache, empty cache, stale cache)
 */
const testWeatherCacheData: WeatherCacheData = {
    raw: testWeatherApiResponse,
    timestamp: Date.now(),
    latitude: 40.7128,
    longitude: -74.006,
}

// ============================================================================
// UNSPLASH TYPES VERIFICATION
// ============================================================================

/**
 * Hover over `UnsplashPhotographer` below to see:
 * - Photographer attribution data for Unsplash background images
 * - Attribution Requirements section
 * - All properties documented
 */
const testUnsplashPhotographer: UnsplashPhotographer = {
    name: 'John Doe',
    username: 'johndoe',
    profileUrl: 'https://unsplash.com/@johndoe',
}

/**
 * Hover over `UnsplashBackground` below to see:
 * - Complete background image data structure from Unsplash API
 * - Daily Refresh Mechanism section
 * - Image Topics section
 * - Storage section (localStorage cache)
 * - All 13 properties documented
 * - Data Flow section (6 steps)
 * - Fallback Behavior section
 * - API Compliance section
 */
const testUnsplashBackground: UnsplashBackground = {
    id: 'abc123',
    url: 'https://images.unsplash.com/photo-abc123',
    fullUrl: 'https://images.unsplash.com/photo-abc123?w=1920',
    thumbUrl: 'https://images.unsplash.com/photo-abc123?w=400',
    blurHash: 'L6PZfSjE.AyE_3t7t7R**0o#DgR4',
    color: '#0c4a6e',
    description: 'Beautiful sunset over mountains',
    photographer: testUnsplashPhotographer,
    unsplashUrl: 'https://unsplash.com/photos/abc123',
    downloadLocation: 'https://api.unsplash.com/photos/abc123/download',
    fetchDate: '2024-12-25',
    topic: 'nature',
    stale: false,
}

// ============================================================================
// DATE MATCHER TYPES VERIFICATION
// ============================================================================

/**
 * Hover over `DateMatchPosition` below to see:
 * - Text position tracking for date matches
 * - Usage in date parsing workflow
 */
const testDateMatchPosition: DateMatchPosition = {
    start: 0,
    end: 8,
}

/**
 * Hover over `TimeMatch` below to see:
 * - Time expression match with AM/PM support
 * - All properties documented
 * - Examples (12hr with AM/PM, 24hr, bare hour)
 */
const testTimeMatch: TimeMatch = {
    hour: 14,
    minute: 30,
    isPM: true,
    hasExplicitPeriod: true,
}

/**
 * Hover over `DateCandidate` below to see:
 * - Internal candidate during parsing (with Date objects)
 * - Usage in date-finders.ts
 * - All properties documented
 * - Examples (various candidate scenarios)
 */
const testDateCandidate: DateCandidate = {
    date: new Date('2024-12-25'),
    match: testDateMatchPosition,
    hasTime: false,
}

/**
 * Hover over `ParsedDate` below to see:
 * - Final parsed result with ISO string (public API)
 * - Natural Language Support section
 * - Date Highlighting section
 * - Usage in AddTask component
 * - All properties documented
 */
const testParsedDate: ParsedDate = {
    due: '2024-12-25',
    hasTime: false,
    match: testDateMatchPosition,
}

/**
 * Hover over `FormatOptions` below to see:
 * - Formatting configuration for date display
 * - All properties documented
 * - Usage in formatDateForDisplay()
 * - Examples
 */
const testFormatOptions: FormatOptions = {
    dateFormat: 'mdy',
    includeYear: true,
}

// ============================================================================
// PROVIDER CONFIG TYPES VERIFICATION
// ============================================================================

/**
 * Hover over `CalendarProviderConfig` below to see:
 * - Configuration options for calendar provider backends
 * - Current Implementation section
 * - Factory Usage section
 * - Future Extensibility section
 * - Potential Future Properties section
 * - Potential Future Providers section
 */
const testCalendarProviderConfig: CalendarProviderConfig = {}

// ============================================================================
// VERIFICATION COMPLETE
// ============================================================================

/**
 * If you can see JSDoc tooltips when hovering over all type names above,
 * then the documentation is working correctly in your IDE!
 *
 * Expected tooltip content:
 * ✓ Clear descriptions of what each type represents
 * ✓ Property documentation with types and descriptions
 * ✓ Code examples showing usage
 * ✓ @see references that link to related types and files
 * ✓ Sections explaining patterns (Raw vs Processed, Caching, etc.)
 * ✓ Cross-references to implementation files
 */
export const VERIFICATION_COMPLETE = true
