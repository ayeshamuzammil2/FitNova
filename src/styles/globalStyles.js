import { StyleSheet } from 'react-native';

export const globalStyles = (theme) => StyleSheet.create({
  // Root container centered vertically and horizontally (For Sign Up / Login / Centered states)
  centerContainer: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  // Basic scroll container covering full screen
  scrollContainer: {
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
  },
  // Full width dynamic scroll container suitable for cross-platform matching
  scrollContainerDynamic: {
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
  },
  // Inner wrapper padding for scroll views
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
    width: '100%',
    alignSelf: 'center',
  },
  // Symmetric horizontal and vertical padded container - Updated to full screen width
  scrollContentPadding: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
    alignSelf: 'center',
  },
  // Header/Top layout row with items separated on edges - Updated to full screen width
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
  },
  // Top layout row featuring enhanced spacing variables - Updated to full screen width
  topRowSpacing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
    marginTop: 12,
    width: '100%',
    alignSelf: 'center',
  },
  // Right-aligned flexible box for top row items
  topRowRight: {
    justifyContent: 'flex-end',
  },
  // Main identity logo typography with dynamic theme color handling
  logo: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    color: theme.background === '#111A1A' ? '#D6BD98' : '#222831', 
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  // Standard prominent section header title text
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.textLight,
    letterSpacing: 0.5,
  },
  // Centered supporting description or secondary header typography
  subTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
    color: theme.textGray,
    lineHeight: 18,
    letterSpacing: 0.5,
    paddingHorizontal: 15,
  },
  // Primary readable standard body text configuration
  bodyText: {
    fontSize: 15,
    color: theme.textLight,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  // Secondary text with lowered visual weight
  mutedText: {
    fontSize: 13,
    color: theme.textGray,
    letterSpacing: 0.3,
  },
  // Spaced utility helper adding top margin and subtle opacity
  mutedTextSpacing: {
    marginTop: 4,
    opacity: 0.8,
  },
  // Styled system tag text typography using conditional dark/light theme accents
  tagText: {
    color: theme.background === '#111A1A' ? '#D6BD98' : theme.primary,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  // Explicit font weight bold configuration helper
  boldWeightText: {
    fontWeight: '700',
  },
  // Explicit text color class mapping directly to theme grey colors
  textGrayDynamic: {
    color: theme.textGray,
  },
  // Explicit text color class mapping directly to theme light colors
  textLightDynamic: {
    color: theme.textLight,
  },
  // Form input UI field with constraints ensuring cross-platform stability - Updated to full width
  input: {
    width: '100%',
    paddingHorizontal: 16,     // Keeps text safely away from the borders
    paddingVertical: 12,       // Delivers a clean vertical structure
    borderRadius: 14, 
    marginBottom: 16,
    borderWidth: 1.5,
    fontSize: 15,
    backgroundColor: theme.background === '#111A1A' ? '#111A1A' : theme.secondary,
    color: theme.textLight,
    borderColor: theme.border,
    alignSelf: 'center',       
  },
  // Responsive standard system action button with conditional theme shadows - Updated to full width
  btn: {
    width: '100%',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: theme.background === '#111A1A' ? '#D6BD98' : '#222831', 
    shadowColor: theme.background === '#111A1A' ? '#D6BD98' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.background === '#111A1A' ? 0.3 : 0.15,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',       
  },
  // Styled font wrapper configuration inside main action buttons
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.background === '#111A1A' ? '#111A1A' : '#FFFFFF', 
    letterSpacing: 0.5,
  },
  // Back navigational button text properties
  backToHomeBtnText: {
    color: '#00A8FF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // Pill button component wrapper navigating backwards using alpha-channels
  backToHomeBtnDynamic: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 99,
    borderWidth: 1,
    backgroundColor: theme.background === '#111A1A' ? 'rgba(0, 168, 255, 0.08)' : '#F0F9FF', 
    borderColor: theme.background === '#111A1A' ? 'rgba(0, 168, 255, 0.2)' : '#E0F2FE',
  },
  // Interface utility button configuration toggling app styles/themes
  themeToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  // Explicit navigational chip shortcut heading into user details profiles
  accountBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    backgroundColor: theme.secondary,
    borderWidth: 1.5,
    borderColor: theme.background === '#111A1A' ? '#D6BD98' : theme.primary,
  },
  // Interactive anchor-styled wrapping element creating interactive margins
  textLinkBtn: {
    marginTop: 30,
    alignItems: 'center',
  },
  // Right layout aligned utility block positioning actionable hyperlinks
  rightAlignBtn: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  // Standalone bright blue structural textual call to action text
  actionLinkText: {
    color: '#00A8FF',
    fontWeight: '800',
    fontSize: 14,
  },
  // Neutralized standard link color formatting reference
  linkTextGray: {
    color: theme.textGray,
    fontSize: 14,
  },
  // Contrasted highlight anchor link typeface definition
  linkTextBold: {
    color: theme.textLight,
    fontWeight: 'bold',
  },
  // Layout spacing element containing multi-layered headline groups - Updated to full width
  headerTextGroup: {
    marginBottom: 32,
    width: '100%',
    alignSelf: 'center',
  },
  // Ultra bold, high priority identity typography for deep headings
  headerMainTitle: {
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  // Secondary level editorial text paired beneath massive primary titles
  headerSubDesc: {
    fontSize: 15,
    lineHeight: 25,
    opacity: 0.9,
  },
  // Dynamic tag typography wrapper adjusting tint blocks depending on light/dark themes
  topRowTagTextDynamic: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: theme.background === '#111A1A' ? '#D6BD98' : '#00A8FF',
    backgroundColor: theme.background === '#111A1A' ? 'rgba(214, 189, 152, 0.1)' : 'rgba(0, 168, 255, 0.06)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  // Standard container widget card component - Updated to full width
  widget: {
    padding: 22,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: theme.secondary,
    width: '100%',
    borderColor: theme.border,
    borderWidth: 1,
    alignSelf: 'center',       
  },
  // Typography block mapping standard headings inside system cards
  widgetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.textLight,
    letterSpacing: 0.3,
  },
  // Structural margin helper separating titles from inside card information
  widgetTitleSpacing: {
    marginBottom: 18,
  },
  // Visually highlighted state design variation for container cards - Updated to full width
  widgetActive: {
    padding: 22,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: theme.secondary,
    borderColor: theme.background === '#111A1A' ? '#D6BD98' : theme.textLight,
    borderWidth: 1.5,
    shadowColor: theme.background === '#111A1A' ? '#D6BD98' : 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
    alignSelf: 'center',
  },
  // Header text class for analytic reading modules
  telemetryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00A8FF',
    marginBottom: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  // Data layout label containing secondary tracking parameters
  telemetryWeightRow: {
    marginTop: 4,
    fontSize: 16,
  },
  // Data layout label containing system physical heights metrics
  telemetryHeightRow: {
    color: theme.textLight,
    marginTop: 6,
    fontSize: 16,
  },
  // Main prioritized telemetry text display emphasizing computed scores
  telemetryBmiRow: {
    color: '#00A8FF',
    fontWeight: '800',
    marginTop: 18,
    fontSize: 20, 
    letterSpacing: -0.3,
  },
  // High fidelity styled data block managing dynamic visual drop-shadowing - Updated to full width
  telemetryActiveWidgetDynamic: {
    padding: 26,
    borderRadius: 24, 
    borderWidth: 1,
    marginVertical: 12,
    width: '100%',
    backgroundColor: theme.secondary,
    borderColor: theme.background === '#111A1A' ? 'rgba(0, 168, 255, 0.25)' : 'rgba(0, 168, 255, 0.15)',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: theme.background === '#111A1A' ? 0.05 : 0.08,
    shadowRadius: 20,
    elevation: 4,
    alignSelf: 'center',
  },
  // Layout spacing grid holding safe areas for platform primary buttons - Updated to full width
  actionBtnContainer: {
    marginTop: 28,
    paddingBottom: 40,
    width: '100%',
    alignSelf: 'center',
  },
  // Standard fixed high dimension functional primary key style button
  calibratedMatrixBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#00A8FF',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  // Standard typeface styling used inside calibrated blue action items
  calibratedMatrixBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  // Full layout screen state locked structure centering layout options (Kept centered for lock states)
  lockedScreenContainer: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Screen overlay wrapper keeping lock modules isolated and safely configured - Updated to full width
  lockScreenWrapperDynamic: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
  },
  // Dashed security alerting graphical box enclosing error messaging parameters - Updated to full width
  lockWidgetCard: {
    borderColor: theme.error || '#EF4444',
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 40,
    borderRadius: 28,
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.secondary,
    alignSelf: 'center',
  },
  // Massive centralized contextual iconic emoji indicator typeface properties
  lockWidgetIcon: {
    fontSize: 54,
    marginBottom: 20,
  },
  // Primary security notification title text
  lockWidgetTitle: {
    textAlign: 'center',
    fontSize: 22,
    color: theme.error || '#EF4444',
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  // System lock descriptive communication copy detailing security parameters
  lockWidgetDesc: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.8,
  },
  // Navigation key driving exits away from restricted states
  lockReturnBtn: {
    backgroundColor: '#00A8FF',
    width: '100%',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  // Font structural style nested inside returning safety keys
  lockReturnBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  // Standard background screen masking block initializing system modals - Updated to stretch full screen
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.background === '#111A1A' ? 'rgba(34, 40, 49, 0.85)' : 'rgba(57, 62, 70, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  // Modal layout structural window restricting card widths over expanded screens - Updated to full width
  modalWidget: {
    width: '100%',
    padding: 25,
    alignSelf: 'center',
  },
  // Title color configuration override enforcing error values
  modalErrorTitle: {
    color: theme.error,
  },
  // Inner body separation utility defining layout text copy limits inside models
  modalBodyText: {
    marginVertical: 15,
    opacity: 0.9,
  },
  // System action element explicitly customized with an error theme color palette
  errorBtn: {
    backgroundColor: theme.error,
  },
  // Text wrapper structure nested directly inside platform exception action steps
  errorBtnText: {
    color: '#FFFFFF',
  },
  // Success state text feedback with absolute centering and consistent padding
  successText: {
    color: theme.textLight,
    fontWeight: '700',
    fontSize: 15,
    marginVertical: 10,
    textAlign: 'center',
  },
  // System process failure textual alert message feedback formatting rule
  errorText: {
    color: theme.error,
    fontWeight: '700',
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
  },
});