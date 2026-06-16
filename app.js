/* ========================================================
   KM Chit Fund - Core Application Logic (With Auth & Demo Fallback)
   ======================================================== */

// Global App State
let supabaseClient = null;
let appState = {
    members: [],
    payments: [],
    gifts: [],
    qrSettings: {
        upi_id: 'vinaipriyan-2@okaxis',
        qr_name: 'vinai priyan',
        qr_image: '/default_qr.jpg' 
    },
    appSettings: {
        company_name: 'MK Diwali Fund',
        company_address: 'Trichy, Tamil Nadu',
        company_mobile: '9514541504',
        company_logo: ''
    },
    currentView: 'dashboard',
    connectionStatus: false,
    demoMode: false,
    language: 'ta',
    userRole: 'admin',
    currentUserContact: null,
    currentUserMember: null
};

// ========================================================
// TRANSLATION SYSTEM DICTIONARY (i18n)
// ========================================================
const i18n = {
    ta: {
        company_tagline: "ஒவ்வோர் சேமிப்பும் ஒரு தீபம் 🪔",
        tagline_main: '"ஒவ்வோர் சேமிப்பும்"',
        tagline_sub: '"ஒரு தீபம் 🪔"',
        login_tagline: '"ஒவ்வோர் சேமிப்பும் ஒரு தீபம் 🪔"',
        nav_dashboard: "🏠 முகப்பு",
        nav_member_reg: "👥 உறுப்பினர் பதிவு",
        nav_member_list: "📋 உறுப்பினர் பட்டியல்",
        nav_payment_mgmt: "💰 கட்டண மேலாண்மை",
        nav_gift_items: "🎁 பரிசுப் பொருட்கள்",
        nav_qr_payment: "📱 ஆன்லைன் கட்டணம்",
        nav_reports: "📊 அறிக்கைகள்",
        nav_contact: "📞 தொடர்புக்கு",
        status_offline: "🔴 Not Connected",
        logout: "வெளியேறு (Logout)",
        phase_badge: "Phase 1 (Admin Mode)",
        dash_welcome: "வரவேற்கிறோம், நிர்வாகி!",
        dash_welcome_sub: "MK தீபாவளி ஃபண்ட் மேலாண்மை தளம் உங்களை அன்புடன் வரவேற்கிறது. இன்றைய நிலவரங்கள் கீழே தொகுக்கப்பட்டுள்ளன.",
        stat_members: "மொத்த உறுப்பினர்கள்",
        stat_collection: "மொத்த சேகரிப்பு",
        stat_pending: "நிலுவைத் தொகை",
        stat_cash: "ரொக்கக் கட்டணம் (Cash)",
        stat_qr: "ஆன்லைன் கட்டணம் (UPI)",
        chart_title: "கட்டண புள்ளிவிவரங்கள்",
        chart_col: "சேகரிக்கப்பட்ட தொகை (Collection)",
        chart_pen: "நிலுவைத் தொகை (Pending)",
        chart_cash: "ரொக்க வழி கட்டணங்கள் (Cash)",
        chart_qr: "ஆன்லைன் வழி கட்டணங்கள் (Online Payment)",
        quick_title: "விரைவான செயல்பாடு",
        quick_member: "புதிய உறுப்பினர் பதிவு",
        quick_payment: "கட்டணம் பதிவு செய்க",
        quick_qr: "ஆன்லைன் விவரங்கள் காண்க",
        reg_title: "புதிய உறுப்பினர் பதிவு படிவம்",
        reg_sub: "புதிய சிட் உறுப்பினரை சேர்க்க கீழே உள்ள விவரங்களை பூர்த்தி செய்யவும்.",
        reg_member_id: "உறுப்பினர் குறியீடு (Member ID)",
        reg_id_placeholder: "MK-1001 (தானியங்கி)",
        reg_id_help: "சிஸ்டம் மூலம் தானியங்கி குறியீடு உருவாக்கப்படும்.",
        reg_name: "பெயர் (Name)",
        reg_name_placeholder: "பெயரை உள்ளிடவும்",
        reg_contact: "கைபேசி எண் (Contact No)",
        reg_contact_placeholder: "கைபேசி எண்ணை உள்ளிடவும்",
        reg_chit_amount: "சிட் தொகை (Chit Amount)",
        reg_chit_amount_placeholder: "உதாரணமாக: 50000",
        reg_address: "முகவரி (Address)",
        reg_address_placeholder: "முகவரியை உள்ளிடவும்",
        clear_btn: "அழித்து எழுதுக",
        save_btn: "பதிவு செய்க",
        search_placeholder: "பெயர் அல்லது கைபேசி எண் மூலம் தேடுக...",
        print_btn: "அச்சிடு",
        th_id: "குறியீடு (ID)",
        th_name: "பெயர்",
        th_contact: "கைபேசி எண்",
        th_address: "முகவரி",
        th_chit_amount: "சிட் தொகை (₹)",
        th_paid_amount: "செலுத்திய தொகை (₹)",
        th_pending_amount: "நிலுவைத் தொகை (₹)",
        th_interest: "வட்டி/லாபம் (₹)",
        th_actions: "செயல்பாடுகள்",
        no_members: "உறுப்பினர்கள் யாரும் இல்லை...",
        reg_interest: "வட்டி / லாபம் (Interest/Dividend)",
        pay_title: "கட்டணம் செலுத்துதல்",
        pay_sub: "உறுப்பினர் வாரியாக சிட் தவணை கட்டணத்தை இங்கே பதிவு செய்யவும்.",
        pay_select_member: "உறுப்பினர் தேர்வு செய்க (Select Member)",
        pay_select_default: "உறுப்பினரைத் தேர்ந்தெடுக்கவும்",
        pay_info_chit: "சிட் தொகை:",
        pay_info_paid: "செலுத்தியது:",
        pay_info_pending: "நிலுவை:",
        pay_info_interest: "வட்டி/லாபம்:",
        pay_amount: "செலுத்தும் தொகை (Amount Paid)",
        pay_amount_placeholder: "தொகையை உள்ளிடவும்",
        pay_mode: "கட்டண முறை (Payment Mode)",
        pay_mode_cash: "ரொக்கம் (Cash)",
        pay_mode_qr: "ஆன்லைன் கட்டணம் (Online Payment)",
        pay_mode_online: "ஆன்லைன் கட்டணம் (Online Payment)",
        pay_date: "தேதி (Payment Date)",
        pay_submit_btn: "கட்டணத்தை சேமி",
        pay_history_title: "கட்டண வரலாறு (Recent Payments)",
        filter_all: "அனைத்து கட்டண முறை",
        filter_cash: "ரொக்கம் மட்டும்",
        filter_qr: "ஆன்லைன் கட்டணம் மட்டும்",
        filter_online: "ஆன்லைன் கட்டணம் மட்டும்",
        filter_start_date: "தொடக்கத் தேதி:",
        filter_end_date: "முடிவுத் தேதி:",
        reset_btn_text: "மீட்டமை",
        filter_total_label: "தேர்ந்தெடுக்கப்பட்ட மொத்த வரவு:",
        th_contact_simple: "கைபேசி",
        th_pay_mode: "கட்டண முறை",
        th_date: "தேதி",
        no_payments: "பதிவுகள் ஏதும் இல்லை...",
        gift_banner_title: "சிட் பரிசுப் பொருட்கள்",
        gift_banner_sub: "உங்கள் சேமிப்புக்கு எங்கள் சிறந்த பரிசு!",
        gift_tab_all: "அனைத்தும்",
        gift_tab_goldsilver: "தங்கம் & வெள்ளி (Gold & Silver)",
        gift_tab_sweets: "இனிப்பு & காரம் (Sweets & Kaaram)",
        gift_tab_crackers: "பட்டாசுகள் (Crackers)",
        gift_tab_groceries: "மளிகைப் பொருட்கள் (Home Groceries)",
        gift_add_btn: "புதிய பரிசுப் பொருள் சேர்",
        qr_title: "QR கட்டண மையம்",
        qr_scan_msg: '"QR-ஐ Scan செய்து கட்டணத்தை செலுத்துங்கள்"',
        qr_upload: "Upload QR",
        qr_download: "Download QR",
        qr_print: "Print QR",
        qr_replace: "Replace QR",
        qr_sim_title: "கட்டண சரிபார்ப்பு / உதவி",
        qr_step1_title: "ஸ்கேன் செய்யுங்க",
        qr_step1_desc: "உங்கள் மொபைல் UPI ஆப் (GPay/PhonePe) மூலம் QR-ஐ ஸ்கேன் செய்யுங்கள்.",
        qr_step2_title: "தொகையை செலுத்தவும்",
        qr_step2_desc: "உரிய தவணை தொகையை உள்ளிட்டுக் கட்டணத்தை செலுத்தவும்.",
        qr_step3_title: "நிர்வாகியிடம் பகிரவும்",
        qr_step3_desc: "கட்டணப் பரிவர்த்தனை ரசீதை நிர்வாகியிடம் காட்டி, தவணை கட்டணத்தை வரவு வைக்கவும்.",
        qr_trust_title: "நம்பிக்கையான பரிவர்த்தனை",
        qr_trust_desc: "உங்களது ஒவ்வொரு சேமிப்பும் பாதுகாப்பாக கண்காணிக்கப்படுகிறது.",
        report_toolbar_title: "அறிக்கை விவரங்கள்",
        report_print_btn: "அச்சிடு (Print)",
        report_pdf_btn: "PDF ஆகப் பதிவிறக்கு",
        report_doc_title: "நிதி அறிக்கை (Financial Report)",
        report_date_label: "தேதி",
        report_chart_title: "கட்டண வரவு vs நிலுவை ஒப்பீடு (Collection vs Pending Charts)",
        chart_lbl_total: "சிட் தொகை",
        chart_lbl_paid: "வரவு",
        chart_lbl_pending: "நிலுவை",
        chart_lbl_qr: "ஆன்லைன் வரவு",
        report_sig_creator: "தயாரித்தவர்",
        report_sig_manager: "மேலாளர் கையொப்பம்",
        contact_owner_title: "நிர்வாகி விவரங்கள் (Owner Details)",
        contact_owner_sub: "MK தீபாவளி ஃபண்ட் உரிமையாளர் மற்றும் தொடர்பு விவரங்கள்.",
        owner_name_lbl: "நிர்வாகி பெயர்:",
        owner_phone_lbl: "கைபேசி எண்:",
        owner_email_lbl: "மின்னஞ்சல்:",
        owner_address_lbl: "அலுவலக முகவரி:",
        whatsapp_title: "வாட்ஸ்அப் குழு (WhatsApp Group)",
        whatsapp_sub: "எங்கள் சிட் பண்ட் வாடிக்கையாளர் குழுவில் இணைந்து உடனுக்குடன் தகவல்களைப் பெறுங்கள்.",
        whatsapp_desc: "அறிவிப்புகள், மாதாந்திர தவணை நிலவரங்கள் மற்றும் சிறப்பு அறிவிப்புகளைப் பெற வாட்ஸ்அப் குழுவில் இணையுங்கள்.",
        whatsapp_btn_text: "குழுவில் இணையவும் (Join Group)",
        whatsapp_footer_text: "உடனடி வாட்ஸ்அப் இணைப்பு",
        gift_modal_title: "புதிய பரிசுப் பொருள் பதிவு",
        gift_modal_name: "பரிசின் பெயர் (Name)",
        gift_modal_name_placeholder: "லட்டு, மிக்ஸி...",
        gift_modal_category: "வகை (Category)",
        gift_modal_desc: "விளக்கம் (Description)",
        gift_modal_desc_placeholder: "பரிசுப் பொருள் பற்றிய சிறுகுறிப்பு...",
        gift_modal_image: "பரிசுப் படம் (Upload Image)",
        gift_modal_cancel: "ரத்து செய்க",
        gift_modal_save: "சேமிக்க",
        login_id_label: "Email or Mobile Number *",
        login_id_placeholder: "மின்னஞ்சல் அல்லது கைபேசி எண்",
        qr_settings_title: "QR அமைப்புகள் (QR Settings)",
        settings_upi_id: "UPI ID",
        settings_qr_name: "பெறுநர் பெயர் (Receiver Name)",
        settings_qr_image: "QR படம் மாற்று (Upload QR Image)",
        settings_qr_image_help: "புதிய QR குறியீடு படத்தை பதிவேற்றவும் (விருப்பம்).",
        member_history_title: "எனது கட்டண வரலாறு (My Payments)"
    },
    en: {
        company_tagline: "Every Saving Lights a Dream ✨",
        tagline_main: '"Every Saving"',
        tagline_sub: '"Lights a Dream ✨"',
        login_tagline: '"Every Saving Lights a Dream ✨"',
        nav_dashboard: "🏠 Home / Dashboard",
        nav_member_reg: "👥 Add Member",
        nav_member_list: "📋 Member List",
        nav_payment_mgmt: "💰 Payments",
        nav_gift_items: "🎁 Gift Items",
        nav_qr_payment: "📱 Online Payment",
        nav_reports: "📊 Reports",
        nav_contact: "📞 Contact Info",
        status_offline: "🔴 Not Connected",
        logout: "Logout",
        phase_badge: "Phase 1 (Admin Mode)",
        dash_welcome: "Welcome, Admin!",
        dash_welcome_sub: "MK Diwali Fund Management Platform welcomes you. Today's summary is compiled below.",
        stat_members: "Total Members",
        stat_collection: "Total Collection",
        stat_pending: "Pending Amount",
        stat_cash: "Cash Payments",
        stat_qr: "Online Payments (UPI)",
        chart_title: "Payment Statistics",
        chart_col: "Instalment Collected (Collection)",
        chart_pen: "Instalment Outstanding (Pending)",
        chart_cash: "Cash Collection Mode (Cash)",
        chart_qr: "Online Collection Mode (Online)",
        quick_title: "Quick Actions",
        quick_member: "New Member Registration",
        quick_payment: "Record Instalment Paid",
        quick_qr: "View Online Payment Info",
        reg_title: "New Member Registration Form",
        reg_sub: "Fill in the details below to register a new member in the chit scheme.",
        reg_member_id: "Member ID Code",
        reg_id_placeholder: "MK-1001 (Auto-generated)",
        reg_id_help: "System will auto-generate serial ID on save.",
        reg_name: "Member Full Name",
        reg_name_placeholder: "Enter member's name",
        reg_contact: "Mobile Contact No",
        reg_contact_placeholder: "Enter 10-digit mobile number",
        reg_chit_amount: "Chit Target Value (Amount)",
        reg_chit_amount_placeholder: "e.g., 50000",
        reg_address: "Residential Address",
        reg_address_placeholder: "Enter postal/street address",
        clear_btn: "Clear / Reset Form",
        save_btn: "Register Member",
        search_placeholder: "Search by Name, Contact, or Member ID...",
        print_btn: "Print List",
        th_id: "Member ID",
        th_name: "Name",
        th_contact: "Contact No",
        th_address: "Address",
        th_chit_amount: "Chit Value (₹)",
        th_paid_amount: "Total Paid (₹)",
        th_pending_amount: "Outstanding Balance (₹)",
        th_interest: "Interest/Dividend (₹)",
        th_actions: "Actions",
        no_members: "No members registered yet...",
        reg_interest: "Interest / Dividend",
        pay_title: "Log New Instalment Payment",
        pay_sub: "Record new chit payment received from members.",
        pay_select_member: "Select Scheme Member",
        pay_select_default: "Choose a registered member...",
        pay_info_chit: "Chit Amount:",
        pay_info_paid: "Total Paid:",
        pay_info_pending: "Balance:",
        pay_info_interest: "Interest/Div:",
        pay_amount: "Instalment Amount Paid",
        pay_amount_placeholder: "Enter amount in ₹",
        pay_mode: "Instalment Payment Mode",
        pay_mode_cash: "Cash Mode",
        pay_mode_qr: "Online Payment",
        pay_mode_online: "Online Payment",
        pay_date: "Payment Date",
        pay_submit_btn: "Save Instalment Receipt",
        pay_history_title: "Recent Instalments Log",
        filter_all: "All Payment Modes",
        filter_cash: "Cash Payments Only",
        filter_qr: "Online Payments Only",
        filter_online: "Online Payments Only",
        filter_start_date: "Start Date:",
        filter_end_date: "End Date:",
        reset_btn_text: "Reset",
        filter_total_label: "Total Collection:",
        th_contact_simple: "Contact",
        th_pay_mode: "Payment Mode",
        th_date: "Paid Date",
        no_payments: "No payment transactions logged...",
        gift_banner_title: "Chit Bonus & Gifts",
        gift_banner_sub: "Premium incentives and gifts for your valuable savings!",
        gift_tab_all: "Show All",
        gift_tab_goldsilver: "Gold & Silver",
        gift_tab_sweets: "Sweets & Savories",
        gift_tab_crackers: "Festival Crackers",
        gift_tab_groceries: "Grocery Packs",
        gift_add_btn: "Create New Gift Card",
        qr_title: "UPI QR Payments Desk",
        qr_scan_msg: '"Scan this QR code using GPay / PhonePe to pay"',
        qr_upload: "Upload New QR Image",
        qr_download: "Download QR Image",
        qr_print: "Print QR Signboard",
        qr_replace: "Reset QR to Default",
        qr_sim_title: "UPI Payment Help & Verify",
        qr_step1_title: "Step 1: Scan",
        qr_step1_desc: "Open any UPI App (GPay/PhonePe) and scan the QR code.",
        qr_step2_title: "Step 2: Pay",
        qr_step2_desc: "Enter your target instalment amount and confirm payment.",
        qr_step3_title: "Step 3: Notify Manager",
        qr_step3_desc: "Show your payment success screen to the manager to update log.",
        qr_trust_title: "Secure Transactions",
        qr_trust_desc: "Your chit fund investments are monitored and updated securely.",
        report_toolbar_title: "Financial Reports Desk",
        report_print_btn: "Print Report Sheet",
        report_pdf_btn: "Save Report as PDF",
        report_doc_title: "Chit Fund Financial Report",
        report_date_label: "Report Date",
        report_chart_title: "Chit Value vs Collected vs Balance Overview",
        chart_lbl_total: "Target Chit",
        chart_lbl_paid: "Collected",
        chart_lbl_pending: "Balance",
        chart_lbl_qr: "Online Pay",
        report_sig_creator: "Prepared By",
        report_sig_manager: "Manager Signature",
        set_db_title: "Supabase Settings (Developer Setup Wizard)", // Keep for Setup Wizard modal
        contact_owner_title: "Owner Details",
        contact_owner_sub: "MK Diwali Fund Owner Profile & Contact Details.",
        owner_name_lbl: "Owner Name:",
        owner_phone_lbl: "Mobile No:",
        owner_email_lbl: "Email:",
        owner_address_lbl: "Office Address:",
        whatsapp_title: "WhatsApp Customer Group",
        whatsapp_sub: "Join our official customer WhatsApp group for instant updates.",
        whatsapp_desc: "Get announcements, monthly chit status logs, and seasonal notifications. Click the button below to join.",
        whatsapp_btn_text: "Join Group",
        whatsapp_footer_text: "Direct WhatsApp Link",
        gift_modal_title: "Add / Edit Gift Item",
        gift_modal_name: "Gift Item Name",
        gift_modal_name_placeholder: "e.g., 1g Gold Coin, Groceries Pack...",
        gift_modal_category: "Gift Category",
        gift_modal_desc: "Gift Description",
        gift_modal_desc_placeholder: "Give small description about this gift item...",
        gift_modal_image: "Gift Card Image",
        gift_modal_cancel: "Cancel",
        gift_modal_save: "Save Gift",
        login_id_label: "Email or Mobile Number *",
        login_id_placeholder: "Email or 10-digit mobile number",
        qr_settings_title: "QR Code Settings",
        settings_upi_id: "UPI ID",
        settings_qr_name: "Receiver Display Name",
        settings_qr_image: "Change QR Image (Upload)",
        settings_qr_image_help: "Upload a custom QR code image file (optional).",
        member_history_title: "My Payment Transactions Log"
    }
};

// ========================================================
// AUTHENTICATION SERVICE LAYER (AuthService)
// Handles admin login checking and session state.
// Future-ready for Supabase Auth integration.
// ========================================================
const AuthService = {
    async login(email, password) {
        const lowerEmail = email.toLowerCase().trim();
        if ((lowerEmail === 'admin@kmfund.com' || lowerEmail === 'admin@mkdiwalifund.com') && password === 'admin@123') {
            localStorage.setItem('is_logged_in', 'true');
            localStorage.setItem('user_role', 'admin');
            appState.userRole = 'admin';
            appState.currentUserContact = null;
            appState.currentUserMember = null;
            return true;
        }

        // Check for member login: 10-digit mobile number
        const cleanNumber = lowerEmail.replace(/\s+/g, '');
        if (/^\d{10}$/.test(cleanNumber) && password === cleanNumber) {
            // If members are not loaded yet, fetch them from DB / Demo data first
            if (appState.members.length === 0) {
                const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabase_url');
                const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_key');
                const hasEnvConfig = url && !url.includes('your-project-id') && key && !key.includes('your-sb-anon-key');
                
                if (hasEnvConfig || (url && key)) {
                    DBService.initialize(url, key);
                    if (localStorage.getItem('demo_mode') === 'true') {
                        DBService.loadDemoData();
                    } else {
                        try {
                            await DBService.loadMembers();
                            await DBService.loadPayments();
                        } catch (e) {
                            console.error("Failed to load members for verification:", e);
                        }
                    }
                } else {
                    localStorage.setItem('demo_mode', 'true');
                    appState.demoMode = true;
                    DBService.loadDemoData();
                }
            }

            const member = appState.members.find(m => m.contact_no === cleanNumber);
            if (member) {
                localStorage.setItem('is_logged_in', 'true');
                localStorage.setItem('user_role', 'member');
                localStorage.setItem('user_contact', cleanNumber);
                appState.userRole = 'member';
                appState.currentUserContact = cleanNumber;
                appState.currentUserMember = member;
                return true;
            }
        }
        return false;
    },
    isLoggedIn() {
        return localStorage.getItem('is_logged_in') === 'true';
    },
    logout() {
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_contact');
        appState.userRole = 'admin';
        appState.currentUserContact = null;
        appState.currentUserMember = null;
    }
};

// ========================================================
// DATABASE SERVICE LAYER (DBService)
// Encapsulates all interactions with Supabase or Mock Local Storage.
// ========================================================
const DBService = {
    // 1. Initialize Supabase Client
    initialize(url, anonKey) {
        try {
            if (!url || !anonKey) return false;
            supabaseClient = supabase.createClient(url, anonKey);
            return true;
        } catch (err) {
            console.error('Supabase initialization error:', err);
            return false;
        }
    },

    // 2. Test Connection
    async testConnection(url, anonKey) {
        try {
            const client = supabase.createClient(url, anonKey);
            const { data, error } = await client.from('app_settings').select('count', { count: 'exact', head: true });
            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Connection test failed:', err);
            return false;
        }
    },

    // 3. Load All Application Data
    async loadAllData() {
        if (appState.demoMode) {
            this.loadDemoData();
            return true;
        }
        if (!supabaseClient) return false;
        try {
            await Promise.all([
                this.loadAppSettings(),
                this.loadQRSettings(),
                this.loadMembers(),
                this.loadPayments(),
                this.loadGifts()
            ]);
            appState.connectionStatus = true;
            return true;
        } catch (err) {
            console.error('Error loading data:', err);
            appState.connectionStatus = false;
            return false;
        }
    },

    // 4. App Settings (Branding) Operations
    async loadAppSettings() {
        if (appState.demoMode) {
            const saved = localStorage.getItem('demo_app_settings');
            if (saved) appState.appSettings = JSON.parse(saved);
            if (appState.appSettings.company_name && (appState.appSettings.company_name.includes('KM') || appState.appSettings.company_name === 'KM Chit Fund')) {
                appState.appSettings.company_name = 'MK Diwali Fund (Demo Mode)';
                appState.appSettings.company_mobile = '9514541504';
                appState.appSettings.company_address = 'Trichy, Tamil Nadu';
                localStorage.setItem('demo_app_settings', JSON.stringify(appState.appSettings));
            }
            return;
        }
        const { data, error } = await supabaseClient.from('app_settings').select('*').limit(1);
        if (error) throw error;
        if (data && data.length > 0) {
            appState.appSettings = data[0];
            if (appState.appSettings.company_name && (appState.appSettings.company_name.includes('KM') || appState.appSettings.company_name === 'KM Chit Fund')) {
                appState.appSettings.company_name = 'MK Diwali Fund';
                appState.appSettings.company_mobile = '9514541504';
                appState.appSettings.company_address = 'Trichy, Tamil Nadu';
                supabaseClient.from('app_settings').update({
                    company_name: 'MK Diwali Fund',
                    company_mobile: '9514541504',
                    company_address: 'Trichy, Tamil Nadu'
                }).eq('id', appState.appSettings.id).then(({error: upErr}) => {
                    if (upErr) console.error("Database branding migration error:", upErr);
                });
            }
        } else {
            const defaultBranding = {
                company_name: 'MK Diwali Fund',
                company_address: 'Trichy, Tamil Nadu',
                company_mobile: '9514541504',
                company_logo: ''
            };
            const { data: inserted, error: insertErr } = await supabaseClient.from('app_settings').insert([defaultBranding]).select();
            if (!insertErr && inserted.length > 0) {
                appState.appSettings = inserted[0];
            }
        }
    },

    async saveAppSettings(settings) {
        if (appState.demoMode) {
            appState.appSettings = settings;
            localStorage.setItem('demo_app_settings', JSON.stringify(settings));
            return settings;
        }
        const { id, ...updateData } = settings;
        if (id) {
            const { data, error } = await supabaseClient.from('app_settings').update(updateData).eq('id', id).select();
            if (error) throw error;
            appState.appSettings = data[0];
        } else {
            const { data, error } = await supabaseClient.from('app_settings').insert([updateData]).select();
            if (error) throw error;
            appState.appSettings = data[0];
        }
        return appState.appSettings;
    },

    // 5. QR Settings Operations
    async loadQRSettings() {
        if (appState.demoMode) {
            const saved = localStorage.getItem('demo_qr_settings');
            if (saved) appState.qrSettings = JSON.parse(saved);
            if (!appState.qrSettings.upi_id || appState.qrSettings.upi_id.includes('mkdiwalifund') || appState.qrSettings.upi_id.includes('ybl') || (appState.qrSettings.qr_name && (appState.qrSettings.qr_name.includes('KM') || appState.qrSettings.qr_name === 'KM Chit Fund' || appState.qrSettings.qr_name.includes('Diwali')))) {
                appState.qrSettings.qr_name = 'vinai priyan';
                appState.qrSettings.upi_id = 'vinaipriyan-2@okaxis';
                appState.qrSettings.qr_image = '/default_qr.jpg';
                localStorage.setItem('demo_qr_settings', JSON.stringify(appState.qrSettings));
            }
            return;
        }
        const { data, error } = await supabaseClient.from('qr_settings').select('*').limit(1);
        if (error) throw error;
        if (data && data.length > 0) {
            appState.qrSettings = data[0];
            if (!appState.qrSettings.upi_id || appState.qrSettings.upi_id.includes('mkdiwalifund') || appState.qrSettings.upi_id.includes('ybl') || (appState.qrSettings.qr_name && (appState.qrSettings.qr_name.includes('KM') || appState.qrSettings.qr_name === 'KM Chit Fund' || appState.qrSettings.qr_name.includes('Diwali')))) {
                appState.qrSettings.qr_name = 'vinai priyan';
                appState.qrSettings.upi_id = 'vinaipriyan-2@okaxis';
                appState.qrSettings.qr_image = '/default_qr.jpg';
                supabaseClient.from('qr_settings').update({
                    qr_name: 'vinai priyan',
                    upi_id: 'vinaipriyan-2@okaxis',
                    qr_image: '/default_qr.jpg'
                }).eq('id', appState.qrSettings.id).then(({error: upErr}) => {
                    if (upErr) console.error("Database QR settings migration error:", upErr);
                });
            }
        } else {
            const defaultQR = {
                upi_id: 'vinaipriyan-2@okaxis',
                qr_name: 'vinai priyan',
                qr_image: '/default_qr.jpg'
            };
            const { data: inserted, error: insertErr } = await supabaseClient.from('qr_settings').insert([defaultQR]).select();
            if (!insertErr && inserted.length > 0) {
                appState.qrSettings = inserted[0];
            }
        }
    },

    async saveQRSettings(qrSettings) {
        if (appState.demoMode) {
            appState.qrSettings = qrSettings;
            localStorage.setItem('demo_qr_settings', JSON.stringify(qrSettings));
            return qrSettings;
        }
        const { id, ...updateData } = qrSettings;
        updateData.updated_at = new Date().toISOString();
        if (id) {
            const { data, error } = await supabaseClient.from('qr_settings').update(updateData).eq('id', id).select();
            if (error) throw error;
            appState.qrSettings = data[0];
        } else {
            const { data, error } = await supabaseClient.from('qr_settings').insert([updateData]).select();
            if (error) throw error;
            appState.qrSettings = data[0];
        }
        return appState.qrSettings;
    },

    // 6. Member Operations
    async loadMembers() {
        if (appState.demoMode) {
            const saved = localStorage.getItem('demo_members');
            if (saved) appState.members = JSON.parse(saved);
            return;
        }
        const { data, error } = await supabaseClient.from('members').select('*').order('member_id', { ascending: true });
        if (error) throw error;
        
        let migrated = false;
        const membersList = data || [];
        for (const m of membersList) {
            if (m.member_id && m.member_id.startsWith('KM-')) {
                const oldId = m.member_id;
                const newId = oldId.replace('KM-', 'MK-');
                
                // Avoid migration if newId already exists (to prevent foreign key/unique constraint duplicate mappings)
                if (membersList.some(mem => mem.member_id === newId)) {
                    console.warn(`Skipping migration for legacy member ID ${oldId} because target ID ${newId} already exists.`);
                    continue;
                }
                
                try {
                    // Update payments first due to foreign key constraints
                    await supabaseClient.from('payments').update({ member_id: newId }).eq('member_id', oldId);
                    // Update member ID prefix
                    await supabaseClient.from('members').update({ member_id: newId }).eq('id', m.id);
                    m.member_id = newId;
                    migrated = true;
                } catch (e) {
                    console.error("Migration error for member ID prefix: " + oldId, e);
                }
            }
        }
        
        if (migrated) {
            const { data: reloaded, error: reloadError } = await supabaseClient.from('members').select('*').order('member_id', { ascending: true });
            if (!reloadError) {
                appState.members = reloaded || [];
                return;
            }
        }
        
        appState.members = membersList;
    },

    async getNextMemberId() {
        if (appState.members.length === 0) {
            return 'MK-1001';
        }
        const ids = appState.members.map(m => {
            const num = parseInt(m.member_id.replace('MK-', ''));
            return isNaN(num) ? 1000 : num;
        });
        const maxId = Math.max(...ids);
        return `MK-${maxId + 1}`;
    },

    async insertMember(member) {
        if (appState.demoMode) {
            const nextId = await this.getNextMemberId();
            const newMember = {
                id: Math.random().toString(36).substring(2, 9),
                member_id: nextId,
                name: member.name,
                contact_no: member.contact_no,
                address: member.address,
                chit_amount: parseFloat(member.chit_amount),
                interest_amount: parseFloat(member.interest_amount) || 0,
                total_paid: 0,
                pending_amount: parseFloat(member.chit_amount),
                created_at: new Date().toISOString()
            };
            appState.members.push(newMember);
            localStorage.setItem('demo_members', JSON.stringify(appState.members));
            return newMember;
        }

        const nextId = await this.getNextMemberId();
        const memberData = {
            member_id: nextId,
            name: member.name,
            contact_no: member.contact_no,
            address: member.address,
            chit_amount: parseFloat(member.chit_amount),
            interest_amount: parseFloat(member.interest_amount) || 0,
            total_paid: 0,
            pending_amount: parseFloat(member.chit_amount)
        };
        const { data, error } = await supabaseClient.from('members').insert([memberData]).select();
        if (error) throw error;
        appState.members.push(data[0]);
        return data[0];
    },

    async deleteMember(memberId) {
        if (appState.demoMode) {
            appState.members = appState.members.filter(m => m.member_id !== memberId);
            appState.payments = appState.payments.filter(p => p.member_id !== memberId);
            localStorage.setItem('demo_members', JSON.stringify(appState.members));
            localStorage.setItem('demo_payments', JSON.stringify(appState.payments));
            return;
        }

        const { error } = await supabaseClient.from('members').delete().eq('member_id', memberId);
        if (error) throw error;
        appState.members = appState.members.filter(m => m.member_id !== memberId);
        appState.payments = appState.payments.filter(p => p.member_id !== memberId);
    },

    // 7. Payment Operations & Recalculations
    async loadPayments() {
        if (appState.demoMode) {
            const saved = localStorage.getItem('demo_payments');
            if (saved) {
                appState.payments = JSON.parse(saved);
                appState.payments.forEach(p => {
                    p.members = appState.members.find(m => m.member_id === p.member_id);
                });
            }
            return;
        }
        const { data, error } = await supabaseClient.from('payments').select('*, members(name, contact_no, chit_amount)').order('created_at', { ascending: false });
        if (error) throw error;
        appState.payments = data || [];
    },

    async recordPayment(memberId, amountPaid, paymentMode, paymentDate) {
        const numericAmount = parseFloat(amountPaid);
        
        if (appState.demoMode) {
            const newPayment = {
                id: Math.random().toString(36).substring(2, 9),
                member_id: memberId,
                amount_paid: numericAmount,
                payment_mode: paymentMode,
                payment_date: paymentDate,
                created_at: new Date().toISOString()
            };
            
            appState.payments.push(newPayment);
            localStorage.setItem('demo_payments', JSON.stringify(appState.payments));
            
            const member = appState.members.find(m => m.member_id === memberId);
            if (member) {
                member.total_paid = (parseFloat(member.total_paid) || 0) + numericAmount;
                member.pending_amount = parseFloat(member.chit_amount) - member.total_paid;
                localStorage.setItem('demo_members', JSON.stringify(appState.members));
            }
            
            appState.payments.forEach(p => {
                p.members = appState.members.find(m => m.member_id === p.member_id);
            });
            appState.payments.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
            return newPayment;
        }

        // 1. Insert Payment Record (maps 'Online Payment' to 'QR Payment' to satisfy Supabase check constraint)
        const paymentData = {
            member_id: memberId,
            amount_paid: numericAmount,
            payment_mode: paymentMode === 'Online Payment' ? 'QR Payment' : paymentMode,
            payment_date: paymentDate
        };
        const { data: newPayment, error: payError } = await supabaseClient.from('payments').insert([paymentData]).select();
        if (payError) throw payError;

        // 2. Recalculate member details
        const { data: memberPayments, error: fetchPayError } = await supabaseClient.from('payments').select('amount_paid').eq('member_id', memberId);
        if (fetchPayError) throw fetchPayError;

        const totalPaid = memberPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);

        const { data: memberRecord, error: memError } = await supabaseClient.from('members').select('chit_amount').eq('member_id', memberId).single();
        if (memError) throw memError;

        const chitAmount = parseFloat(memberRecord.chit_amount);
        const pendingAmount = chitAmount - totalPaid;

        const { data: updatedMember, error: updateMemError } = await supabaseClient.from('members').update({
            total_paid: totalPaid,
            pending_amount: pendingAmount
        }).eq('member_id', memberId).select();
        
        if (updateMemError) throw updateMemError;

        const memberIndex = appState.members.findIndex(m => m.member_id === memberId);
        if (memberIndex !== -1) {
            appState.members[memberIndex] = updatedMember[0];
        }

        await this.loadPayments();
        return newPayment[0];
    },

    async deletePayment(paymentId, memberId) {
        if (appState.demoMode) {
            const payment = appState.payments.find(p => p.id === paymentId);
            if (payment) {
                const amt = parseFloat(payment.amount_paid);
                appState.payments = appState.payments.filter(p => p.id !== paymentId);
                localStorage.setItem('demo_payments', JSON.stringify(appState.payments));
                
                const member = appState.members.find(m => m.member_id === memberId);
                if (member) {
                    member.total_paid = Math.max(0, (parseFloat(member.total_paid) || 0) - amt);
                    member.pending_amount = parseFloat(member.chit_amount) - member.total_paid;
                    localStorage.setItem('demo_members', JSON.stringify(appState.members));
                }
                
                appState.payments.forEach(p => {
                    p.members = appState.members.find(m => m.member_id === p.member_id);
                });
            }
            return;
        }

        const { error: delError } = await supabaseClient.from('payments').delete().eq('id', paymentId);
        if (delError) throw delError;

        const { data: memberPayments, error: fetchPayError } = await supabaseClient.from('payments').select('amount_paid').eq('member_id', memberId);
        if (fetchPayError) throw fetchPayError;

        const totalPaid = memberPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);

        const { data: memberRecord, error: memError } = await supabaseClient.from('members').select('chit_amount').eq('member_id', memberId).single();
        if (memError) throw memError;

        const chitAmount = parseFloat(memberRecord.chit_amount);
        const pendingAmount = chitAmount - totalPaid;

        const { data: updatedMember, error: updateMemError } = await supabaseClient.from('members').update({
            total_paid: totalPaid,
            pending_amount: pendingAmount
        }).eq('member_id', memberId).select();

        if (updateMemError) throw updateMemError;

        const memberIndex = appState.members.findIndex(m => m.member_id === memberId);
        if (memberIndex !== -1) {
            appState.members[memberIndex] = updatedMember[0];
        }

        await this.loadPayments();
    },

    // 8. Gift Items Operations
    async loadGifts() {
        if (appState.demoMode) {
            const saved = localStorage.getItem('demo_gifts');
            if (saved) appState.gifts = JSON.parse(saved);
            return;
        }
        const { data, error } = await supabaseClient.from('gift_items').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        appState.gifts = data || [];
        
        const hasOldGifts = appState.gifts.some(g => ['லட்டு', 'ஜிலேபி', 'மைசூர் பாக்', 'குலாப் ஜாமூன்', 'சக்கரம்', 'மிக்ஸி'].includes(g.item_name));
        if (appState.gifts.length === 0 || hasOldGifts) {
            if (hasOldGifts) {
                // Delete old defaults so that exactly the 5 new realistic items load
                await supabaseClient.from('gift_items').delete().neq('item_name', '0000_placeholder');
            }
            await this.seedDefaultGifts();
        }
    },

    async insertGift(gift) {
        const encodedDescription = `[வகை: ${gift.category}] ${gift.description}`;
        
        if (appState.demoMode) {
            const newGift = {
                id: Math.random().toString(36).substring(2, 9),
                item_name: gift.name,
                item_image: gift.image || '',
                item_description: encodedDescription,
                created_at: new Date().toISOString()
            };
            appState.gifts.push(newGift);
            localStorage.setItem('demo_gifts', JSON.stringify(appState.gifts));
            return newGift;
        }

        const giftData = {
            item_name: gift.name,
            item_image: gift.image || '',
            item_description: encodedDescription
        };
        const { data, error } = await supabaseClient.from('gift_items').insert([giftData]).select();
        if (error) throw error;
        appState.gifts.push(data[0]);
        return data[0];
    },

    async updateGift(id, gift) {
        const encodedDescription = `[வகை: ${gift.category}] ${gift.description}`;
        
        if (appState.demoMode) {
            const idx = appState.gifts.findIndex(g => g.id === id);
            if (idx !== -1) {
                appState.gifts[idx] = {
                    ...appState.gifts[idx],
                    item_name: gift.name,
                    item_image: gift.image || '',
                    item_description: encodedDescription
                };
                localStorage.setItem('demo_gifts', JSON.stringify(appState.gifts));
                return appState.gifts[idx];
            }
            return null;
        }

        const giftData = {
            item_name: gift.name,
            item_image: gift.image || '',
            item_description: encodedDescription
        };
        const { data, error } = await supabaseClient.from('gift_items').update(giftData).eq('id', id).select();
        if (error) throw error;
        
        const idx = appState.gifts.findIndex(g => g.id === id);
        if (idx !== -1) {
            appState.gifts[idx] = data[0];
        }
        return data[0];
    },

    async deleteGift(id) {
        if (appState.demoMode) {
            appState.gifts = appState.gifts.filter(g => g.id !== id);
            localStorage.setItem('demo_gifts', JSON.stringify(appState.gifts));
            return;
        }

        const { error } = await supabaseClient.from('gift_items').delete().eq('id', id);
        if (error) throw error;
        appState.gifts = appState.gifts.filter(g => g.id !== id);
    },

    async seedDefaultGifts() {
        const defaults = [
            { name: '1 g Gold (தங்கம்)', category: 'GoldSilver', description: 'சிட் சேமிப்பிற்கு வழங்கப்படும் உயர்தர 1 கிராம் தங்க நாணயம் / மோதிரம்.', image: 'gift_gold.png' },
            { name: 'Cracker (தீபாவளி பட்டாசுகள்)', category: 'Crackers', description: 'வண்ணமயமான தீபாவளி சிறப்பு பட்டாசு பெட்டி.', image: 'gift_crackers.png' },
            { name: 'Sweet + Kaaram (இனிப்பு & காரம்)', category: 'Sweets', description: 'சுவையான தீபாவளி ஸ்பெஷல் இனிப்பு மற்றும் காரப் பலகாரங்கள்.', image: 'gift_sweets.png' },
            { name: 'One Silver Pathiram (வெள்ளி பாத்திரம்)', category: 'GoldSilver', description: 'பாரம்பரிய வடிவமைப்பிலான ஒரு வெள்ளி பாத்திரம்.', image: 'gift_silver.png' },
            { name: 'Home Groceries (மளிகைப் பொருட்கள்)', category: 'Groceries', description: 'அனைத்து அத்தியாவசிய வீட்டு மளிகைப் பொருட்களின் சிறப்பு தொகுப்பு.', image: 'gift_groceries.png' }
        ];

        if (appState.demoMode) {
            appState.gifts = defaults.map((g, idx) => ({
                id: 'g' + (idx + 1),
                item_name: g.name,
                item_image: g.image,
                item_description: `[வகை: ${g.category}] ${g.description}`,
                created_at: new Date().toISOString()
            }));
            localStorage.setItem('demo_gifts', JSON.stringify(appState.gifts));
            return;
        }

        const payload = defaults.map(g => ({
            item_name: g.name,
            item_image: g.image,
            item_description: `[வகை: ${g.category}] ${g.description}`
        }));

        const { data, error } = await supabaseClient.from('gift_items').insert(payload).select();
        if (!error && data) {
            appState.gifts = data;
        }
    },

    loadDemoData() {
        if (!localStorage.getItem('demo_members')) {
            const defaultMembers = [
                { id: 'm1', member_id: 'MK-1001', name: 'இராமு', contact_no: '9514541504', address: 'Trichy, Tamil Nadu', chit_amount: 50000, total_paid: 15000, pending_amount: 35000, interest_amount: 1000, created_at: new Date().toISOString() },
                { id: 'm2', member_id: 'MK-1002', name: 'சோமு', contact_no: '9876543211', address: 'காஞ்சிபுரம்', chit_amount: 100000, total_paid: 60000, pending_amount: 40000, interest_amount: 2500, created_at: new Date().toISOString() },
                { id: 'm3', member_id: 'MK-1003', name: 'கண்ணன்', contact_no: '9876543212', address: 'செங்கல்பட்டு', chit_amount: 30000, total_paid: 10000, pending_amount: 20000, interest_amount: 500, created_at: new Date().toISOString() },
                { id: 'm4', member_id: 'MK-1004', name: 'பாலு', contact_no: '9876543213', address: 'திருவள்ளூர்', chit_amount: 50000, total_paid: 50000, pending_amount: 0, interest_amount: 0, created_at: new Date().toISOString() }
            ];
            localStorage.setItem('demo_members', JSON.stringify(defaultMembers));
        }
        
        if (!localStorage.getItem('demo_payments')) {
            const defaultPayments = [
                { id: 'p1', member_id: 'MK-1001', amount_paid: 5000, payment_mode: 'Cash', payment_date: '2026-06-10', created_at: new Date().toISOString() },
                { id: 'p2', member_id: 'MK-1001', amount_paid: 10000, payment_mode: 'QR Payment', payment_date: '2026-06-14', created_at: new Date().toISOString() },
                { id: 'p3', member_id: 'MK-1002', amount_paid: 30000, payment_mode: 'Cash', payment_date: '2026-06-05', created_at: new Date().toISOString() },
                { id: 'p4', member_id: 'MK-1002', amount_paid: 30000, payment_mode: 'QR Payment', payment_date: '2026-06-12', created_at: new Date().toISOString() },
                { id: 'p5', member_id: 'MK-1003', amount_paid: 10000, payment_mode: 'QR Payment', payment_date: '2026-06-11', created_at: new Date().toISOString() },
                { id: 'p6', member_id: 'MK-1004', amount_paid: 20000, payment_mode: 'Cash', payment_date: '2026-06-01', created_at: new Date().toISOString() },
                { id: 'p7', member_id: 'MK-1004', amount_paid: 30000, payment_mode: 'QR Payment', payment_date: '2026-06-08', created_at: new Date().toISOString() }
            ];
            localStorage.setItem('demo_payments', JSON.stringify(defaultPayments));
        }

        if (!localStorage.getItem('demo_gifts')) {
            const defaultGifts = [
                { id: 'g1', item_name: '1 g Gold (தங்கம்)', item_image: 'gift_gold.png', item_description: '[வகை: GoldSilver] சிட் சேமிப்பிற்கு வழங்கப்படும் உயர்தர 1 கிராம் தங்க நாணயம் / மோதிரம்.', created_at: new Date().toISOString() },
                { id: 'g2', item_name: 'Cracker (தீபாவளி பட்டாசுகள்)', item_image: 'gift_crackers.png', item_description: '[வகை: Crackers] வண்ணமயமான தீபாவளி சிறப்பு பட்டாசு பெட்டி.', created_at: new Date().toISOString() },
                { id: 'g3', item_name: 'Sweet + Kaaram (இனிப்பு & காரம்)', item_image: 'gift_sweets.png', item_description: '[வகை: Sweets] சுவையான தீபாவளி ஸ்பெஷல் இனிப்பு மற்றும் காரப் பலகாரங்கள்.', created_at: new Date().toISOString() },
                { id: 'g4', item_name: 'One Silver Pathiram (வெள்ளி பாத்திரம்)', item_image: 'gift_silver.png', item_description: '[வகை: GoldSilver] பாரம்பரிய வடிவமைப்பிலான ஒரு வெள்ளி பாத்திரம்.', created_at: new Date().toISOString() },
                { id: 'g5', item_name: 'Home Groceries (மளிகைப் பொருட்கள்)', item_image: 'gift_groceries.png', item_description: '[வகை: Groceries] அனைத்து அத்தியாவசிய வீட்டு மளிகைப் பொருட்களின் சிறப்பு தொகுப்பு.', created_at: new Date().toISOString() }
            ];
            localStorage.setItem('demo_gifts', JSON.stringify(defaultGifts));
        }

        appState.members = JSON.parse(localStorage.getItem('demo_members'));
        appState.payments = JSON.parse(localStorage.getItem('demo_payments'));
        appState.payments.forEach(p => {
            p.members = appState.members.find(m => m.member_id === p.member_id);
        });
        appState.gifts = JSON.parse(localStorage.getItem('demo_gifts'));
        
        const savedApp = localStorage.getItem('demo_app_settings');
        appState.appSettings = savedApp ? JSON.parse(savedApp) : {
            company_name: 'MK Diwali Fund (Demo Mode)',
            company_address: 'Trichy, Tamil Nadu',
            company_mobile: '9514541504',
            company_logo: ''
        };
        if (appState.appSettings.company_name && (appState.appSettings.company_name.includes('KM') || appState.appSettings.company_name === 'KM Chit Fund')) {
            appState.appSettings.company_name = 'MK Diwali Fund (Demo Mode)';
            appState.appSettings.company_mobile = '9514541504';
            appState.appSettings.company_address = 'Trichy, Tamil Nadu';
            localStorage.setItem('demo_app_settings', JSON.stringify(appState.appSettings));
        }
        
        const savedQr = localStorage.getItem('demo_qr_settings');
        appState.qrSettings = savedQr ? JSON.parse(savedQr) : {
            upi_id: 'vinaipriyan-2@okaxis',
            qr_name: 'vinai priyan',
            qr_image: '/default_qr.jpg'
        };
        if (!appState.qrSettings.upi_id || appState.qrSettings.upi_id.includes('mkdiwalifund') || appState.qrSettings.upi_id.includes('ybl') || (appState.qrSettings.qr_name && (appState.qrSettings.qr_name.includes('KM') || appState.qrSettings.qr_name === 'KM Chit Fund' || appState.qrSettings.qr_name.includes('Diwali')))) {
            appState.qrSettings.qr_name = 'vinai priyan';
            appState.qrSettings.upi_id = 'vinaipriyan-2@okaxis';
            appState.qrSettings.qr_image = '/default_qr.jpg';
            localStorage.setItem('demo_qr_settings', JSON.stringify(appState.qrSettings));
        }
    }
};

// ========================================================
// UTILITY FUNCTIONS & TOAST
// ========================================================
function showToast(message, type = 'success') {
    // If language is English, translate known Tamil messages
    if (appState.language === 'en') {
        const toastTranslations = {
            'டெமோ பயன்முறை தொடங்கப்பட்டது (உள்ளூர் தரவுத்தளம்)!': 'Demo Mode activated (local database)!',
            'தரவுத்தளத்துடன் வெற்றிகரமாக இணைக்கப்பட்டது!': 'Successfully connected to database!',
            'Supabase இணைப்பு தவறியது! இணைய இணைப்பைச் சரிபார்க்கவும்.': 'Supabase connection failed! Check your internet connection.',
            'வெற்றிகரமாக உள்நுழைந்தீர்கள்!': 'Logged in successfully!',
            'மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது!': 'Invalid email or password!',
            'வெளியேறினீர்கள்!': 'Logged out successfully!',
            'உறுப்பினர் பதிவு வெற்றிகரமாக முடிந்தது!': 'Member registered successfully!',
            'கட்டணம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!': 'Payment logged successfully!',
            'பரிசுப் பொருள் திருத்தப்பட்டது!': 'Gift item updated successfully!',
            'புதிய பரிசுப் பொருள் சேர்க்கப்பட்டது!': 'New gift item added successfully!',
            'QR குறியீடு படம் வெற்றிகரமாக மாற்றப்பட்டது!': 'QR code image updated successfully!',
            'QR படம் துவக்க நிலைக்கு மாற்றப்பட்டது.': 'QR image reset to default.',
            'QR பதிவிறக்கம் தொடங்கப்பட்டது...': 'QR download started...',
            'Supabase இணைப்பு சோதிக்கப்பட்டு வெற்றிகரமாக முடிந்தது!': 'Supabase connection tested successfully!',
            'அமைப்புகள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!': 'Settings saved successfully!',
            'இணைப்பு வெற்றிகரமாக முடிந்தது!': 'Connection successful!',
            'வர்த்தக அமைப்புகள் சேமிக்கப்பட்டன!': 'Branding settings saved!',
            'படத்தை ஏற்றுவதில் பிழை!': 'Error loading image!',
            'லோகோவை ஏற்றுவதில் பிழை!': 'Error loading logo!',
            'விவரங்களை உள்ளிடவும்!': 'Please enter details!',
            'அனைத்து விவரங்களையும் உள்ளிடவும்!': 'Please enter all details!',
            'இணைப்பை சோதிக்கிறது...': 'Testing connection...',
            'இணைப்பு சோதிக்கப்படுகிறது...': 'Testing connection...',
            'இணைப்பு தோல்வியடைந்தது! URL அல்லது Key-ஐ சரிபார்க்கவும்.': 'Connection failed! Check URL or Key.',
            'இணைப்பு தவறியது! தரவுத்தள விவரங்களைச் சரிபார்க்கவும்.': 'Connection failed! Check database settings.',
            'இணைப்பு சோதிப்பு தவறியது!': 'Connection test failed!',
            'உறுப்பினரைத் தேர்ந்தெடுக்கவும்!': 'Please select a member!',
            'படம் மாற்றுவதில் தோல்வி!': 'Failed to update image!',
            'மாற்றுவதில் தோல்வி!': 'Failed to update!'
        };
        
        if (toastTranslations[message]) {
            message = toastTranslations[message];
        } else {
            // Handle error messages with prefix
            if (message.startsWith('பதிவு தோல்வியடைந்தது: ')) {
                message = 'Registration failed: ' + message.substring('பதிவு தோல்வியடைந்தது: '.length);
            } else if (message.startsWith('பதிவில் தோல்வி: ')) {
                message = 'Failed to save payment: ' + message.substring('பதிவில் தோல்வி: '.length);
            } else if (message.startsWith('சேமிப்பதில் தோல்வி: ')) {
                message = 'Failed to save: ' + message.substring('சேமிப்பதில் தோல்வி: '.length);
            } else if (message.startsWith('நீக்குவதில் தோல்வி: ')) {
                message = 'Failed to delete: ' + message.substring('நீக்குவதில் தோல்வி: '.length);
            } else if (message.startsWith('தவறு: நிலுவைத் தொகையை விட செலுத்தும் தொகை அதிகமாக உள்ளது')) {
                const maxMatch = message.match(/Max:\s*₹?\s*([0-9,]+)/);
                const maxAmt = maxMatch ? maxMatch[1] : '';
                message = `Error: Paid amount cannot exceed pending balance (Max: ₹${maxAmt})`;
            }
        }
    }

    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-check';
    if (type === 'danger') icon = 'fa-circle-xmark';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function applyLanguage() {
    const lang = appState.language || 'ta';
    
    // Toggle the button label
    const btnToggle = document.getElementById('btn-lang-toggle');
    if (btnToggle) {
        btnToggle.innerHTML = `<i class="fa-solid fa-language"></i> ${lang === 'ta' ? 'EN' : 'தமிழ்'}`;
    }
    const mobileBtnToggle = document.getElementById('btn-mobile-lang-toggle');
    if (mobileBtnToggle) {
        mobileBtnToggle.innerHTML = `<i class="fa-solid fa-language"></i> ${lang === 'ta' ? 'EN' : 'தமிழ்'}`;
    }

    // 1. Static text elements translation
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) {
            el.textContent = i18n[lang][key];
        }
    });

    // 2. Placeholder text elements translation
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang] && i18n[lang][key]) {
            el.placeholder = i18n[lang][key];
        }
    });

    // 3. Re-render titles in current page header
    const titleMap = {
        'ta': {
            'dashboard': '🏠 முகப்பு (Dashboard)',
            'member-reg': '👥 உறுப்பினர் பதிவு (Member Registration)',
            'member-list': '📋 உறுப்பினர் பட்டியல் (Member List)',
            'payment-mgmt': '💰 கட்டண மேலாண்மை (Payment Management)',
            'gift-items': '🎁 பரிசுப் பொருட்கள் (Gift Items)',
            'qr-payment': '📱 QR கட்டணம் (QR Payment)',
            'reports': '📊 அறிக்கைகள் (Reports)',
            'contact': '📞 தொடர்புக்கு (Contact Info)'
        },
        'en': {
            'dashboard': '🏠 Home (Dashboard)',
            'member-reg': '👥 Add Member (Registration)',
            'member-list': '📋 Member List',
            'payment-mgmt': '💰 Payments (Instalment Management)',
            'gift-items': '🎁 Gift Items & Rewards',
            'qr-payment': '📱 QR Payment Desk',
            'reports': '📊 Financial Reports',
            'contact': '📞 Contact Info'
        }
    };
    
    const title = titleMap[lang][appState.currentView] || 'MK Diwali Fund';
    document.getElementById('current-page-title').textContent = title;
    
    enforceRolePermissions();
}

function enforceRolePermissions() {
    const role = appState.userRole || 'admin';
    const isMember = role === 'member';

    // Sidebar navigation items
    const menuMemberReg = document.getElementById('menu-member-reg');
    const menuMemberList = document.getElementById('menu-member-list');
    const menuPaymentMgmt = document.getElementById('menu-payment-mgmt');
    const menuReports = document.getElementById('menu-reports');
    
    // Member Payment History panel on dashboard
    const memberHistoryPanel = document.getElementById('member-payment-history-panel');

    if (isMember) {
        if (menuMemberReg) menuMemberReg.classList.add('hidden');
        if (menuMemberList) menuMemberList.classList.add('hidden');
        if (menuPaymentMgmt) menuPaymentMgmt.classList.add('hidden');
        if (menuReports) menuReports.classList.add('hidden');
        if (memberHistoryPanel) memberHistoryPanel.classList.remove('hidden');

        // Hide admin actions on gift page
        const btnAddGift = document.getElementById('btn-add-gift-modal-trigger');
        if (btnAddGift) btnAddGift.classList.add('hidden');

        // Update phase badge to Member Portal
        const phaseBadge = document.querySelector('.phase-badge');
        if (phaseBadge) {
            phaseBadge.textContent = appState.language === 'ta' ? 'உறுப்பினர் தளம்' : 'Member Portal';
        }

        // Welcome text on dashboard
        const welcomeTitle = document.querySelector('.welcome-text h3');
        const welcomeSub = document.querySelector('.welcome-text p');

        const member = appState.members.find(m => m.contact_no === appState.currentUserContact);
        if (member) {
            appState.currentUserMember = member;
            if (welcomeTitle) {
                welcomeTitle.textContent = appState.language === 'ta' ? `வரவேற்கிறோம், ${member.name}!` : `Welcome, ${member.name}!`;
            }
            if (welcomeSub) {
                welcomeSub.textContent = appState.language === 'ta'
                    ? `உங்கள் சேமிப்பு மற்றும் தவணை நிலவரங்கள் கீழே தொகுக்கப்பட்டுள்ளன.`
                    : `Your savings and instalment status details are summarized below.`;
            }
        }
        
        // Hide Admin QR settings editor, show simulation card
        const adminQREditor = document.getElementById('admin-qr-settings-card');
        const memberQRSim = document.getElementById('member-qr-simulation-card');
        if (adminQREditor) adminQREditor.classList.add('hidden');
        if (memberQRSim) memberQRSim.classList.remove('hidden');
        
    } else {
        if (menuMemberReg) menuMemberReg.classList.remove('hidden');
        if (menuMemberList) menuMemberList.classList.remove('hidden');
        if (menuPaymentMgmt) menuPaymentMgmt.classList.remove('hidden');
        if (menuReports) menuReports.classList.remove('hidden');
        if (memberHistoryPanel) memberHistoryPanel.classList.add('hidden');

        const btnAddGift = document.getElementById('btn-add-gift-modal-trigger');
        if (btnAddGift) btnAddGift.classList.remove('hidden');

        const phaseBadge = document.querySelector('.phase-badge');
        if (phaseBadge) {
            phaseBadge.textContent = appState.language === 'ta' ? 'Phase 1 (Admin Mode)' : 'Phase 1 (Admin Mode)';
        }

        const welcomeTitle = document.querySelector('.welcome-text h3');
        const welcomeSub = document.querySelector('.welcome-text p');
        if (welcomeTitle) {
            welcomeTitle.textContent = appState.language === 'ta' ? 'வரவேற்கிறோம், நிர்வாகி!' : 'Welcome, Admin!';
        }
        if (welcomeSub) {
            welcomeSub.textContent = appState.language === 'ta'
                ? 'MK தீபாவளி ஃபண்ட் மேலாண்மை தளம் உங்களை அன்புடன் வரவேற்கிறது. இன்றைய நிலவரங்கள் கீழே தொகுக்கப்பட்டுள்ளன.'
                : 'MK Diwali Fund Management Platform welcomes you. Today\'s summary is compiled below.';
        }
        
        // Show Admin QR settings editor, hide simulation card
        const adminQREditor = document.getElementById('admin-qr-settings-card');
        const memberQRSim = document.getElementById('member-qr-simulation-card');
        if (adminQREditor) adminQREditor.classList.remove('hidden');
        if (memberQRSim) memberQRSim.classList.add('hidden');
    }
}

function parseGiftDescription(encodedDesc) {
    if (!encodedDesc) return { category: 'Sweets', description: '' };
    const match = encodedDesc.match(/^\[வகை:\s*([^\]]+)\]\s*(.*)$/);
    if (match) {
        return {
            category: match[1],
            description: match[2]
        };
    }
    return {
        category: 'Sweets',
        description: encodedDesc
    };
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function formatCurrency(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return '₹0';
    return '₹' + num.toLocaleString('en-IN');
}

// ========================================================
// RENDER VIEWS
// ========================================================

function updateSidebarBranding() {
    document.getElementById('sidebar-company-name').textContent = appState.appSettings.company_name;
    const mobileCompName = document.getElementById('mobile-company-name-text');
    if (mobileCompName) mobileCompName.textContent = appState.appSettings.company_name;
    
    document.getElementById('header-company-mobile').innerHTML = `<i class="fa-solid fa-phone"></i> <a href="tel:+91${appState.appSettings.company_mobile}" style="color: inherit; text-decoration: none;">+91 ${appState.appSettings.company_mobile}</a>`;
    
    const logoCircle = document.getElementById('sidebar-logo');
    if (appState.appSettings.company_logo) {
        logoCircle.innerHTML = `<img src="${appState.appSettings.company_logo}" alt="Logo" class="logo-preview-img" style="border-radius:50%;width:100%;height:100%;object-fit:cover;">`;
    } else {
        logoCircle.innerHTML = `<img src="/mk_logo.png" alt="Logo" class="logo-preview-img" style="border-radius:50%;width:100%;height:100%;object-fit:cover;">`;
    }
}

function updateConnectionBadge() {
    const sidebarBadge = document.getElementById('connection-status');
    const wizardBadge = document.getElementById('wizard-connection-status');
    const sidebarText = sidebarBadge.querySelector('.status-text');
    const sidebarConnectBtn = document.getElementById('btn-sidebar-connect');

    if (appState.demoMode) {
        sidebarBadge.className = 'status-badge status-demo';
        sidebarBadge.removeAttribute('style');
        sidebarText.textContent = '🟡 Demo Mode';
        
        if (sidebarConnectBtn) sidebarConnectBtn.classList.remove('hidden');
        
        if (wizardBadge) {
            wizardBadge.className = 'status-badge status-demo';
            wizardBadge.removeAttribute('style');
            document.getElementById('wizard-status-text').textContent = 'Demo Mode';
        }
    } else if (appState.connectionStatus) {
        sidebarBadge.removeAttribute('style'); 
        sidebarBadge.className = 'status-badge status-online';
        sidebarText.textContent = '🟢 Connected';
        
        if (sidebarConnectBtn) sidebarConnectBtn.classList.add('hidden');
        
        if (wizardBadge) {
            wizardBadge.removeAttribute('style');
            wizardBadge.className = 'status-badge status-online';
            document.getElementById('wizard-status-text').textContent = 'Connected';
        }
    } else {
        sidebarBadge.removeAttribute('style'); 
        sidebarBadge.className = 'status-badge status-offline';
        sidebarText.textContent = '🔴 Not Connected';
        
        if (sidebarConnectBtn) sidebarConnectBtn.classList.add('hidden');
        
        if (wizardBadge) {
            wizardBadge.removeAttribute('style');
            wizardBadge.className = 'status-badge status-offline';
            document.getElementById('wizard-status-text').textContent = 'Not Connected';
        }
    }
}

function renderDashboard() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dashboard-date').textContent = new Date().toLocaleDateString(appState.language === 'ta' ? 'ta-IN' : 'en-US', options);

    const isMember = appState.userRole === 'member';
    const lang = appState.language || 'ta';
    const cards = document.querySelectorAll('.stats-grid .stats-card');

    if (isMember) {
        const member = appState.members.find(m => m.contact_no === appState.currentUserContact) || appState.currentUserMember;
        if (member) {
            // Update Card 1: Member ID
            if (cards[0]) {
                cards[0].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-user-tag"></i>';
                cards[0].querySelector('.stats-label').textContent = lang === 'ta' ? 'உறுப்பினர் எண் (ID)' : 'Member ID';
            }
            document.getElementById('stat-total-members').textContent = member.member_id;

            // Update Card 2: Chit Value
            if (cards[1]) {
                cards[1].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-sack-dollar"></i>';
                cards[1].querySelector('.stats-label').textContent = lang === 'ta' ? 'சிட் தொகை (Chit Value)' : 'Chit Value';
            }
            document.getElementById('stat-total-collection').textContent = formatCurrency(member.chit_amount);

            // Update Card 3: Total Paid
            if (cards[2]) {
                cards[2].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-check-double"></i>';
                cards[2].querySelector('.stats-label').textContent = lang === 'ta' ? 'செலுத்திய தொகை (Paid)' : 'Total Paid';
            }
            document.getElementById('stat-pending-collection').textContent = formatCurrency(member.total_paid);

            // Update Card 4: Pending Amount
            if (cards[3]) {
                cards[3].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>';
                cards[3].querySelector('.stats-label').textContent = lang === 'ta' ? 'நிலுவைத் தொகை (Pending)' : 'Pending Amount';
            }
            document.getElementById('stat-cash-collection').textContent = formatCurrency(member.pending_amount);

            // Update Card 5: Interest/Dividend
            if (cards[4]) {
                cards[4].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-hand-holding-dollar"></i>';
                cards[4].querySelector('.stats-label').textContent = lang === 'ta' ? 'வட்டி / லாபம்' : 'Interest / Dividend';
            }
            document.getElementById('stat-qr-collection').textContent = formatCurrency(member.interest_amount || 0);

            // Calculate member payments progress
            const totalCollection = member.total_paid;
            const pendingCollection = member.pending_amount;
            const totalPossible = member.chit_amount;

            let cashCollection = 0;
            let qrCollection = 0;
            appState.payments.filter(p => p.member_id === member.member_id).forEach(p => {
                const amt = parseFloat(p.amount_paid) || 0;
                if (p.payment_mode === 'Cash') {
                    cashCollection += amt;
                } else {
                    qrCollection += amt;
                }
            });

            const colPct = totalPossible > 0 ? Math.round((totalCollection / totalPossible) * 100) : 0;
            const penPct = totalPossible > 0 ? Math.round((pendingCollection / totalPossible) * 100) : 0;
            const cashPct = totalCollection > 0 ? Math.round((cashCollection / totalCollection) * 100) : 0;
            const qrPct = totalCollection > 0 ? Math.round((qrCollection / totalCollection) * 100) : 0;

            document.getElementById('chart-collection-percent').textContent = `${colPct}%`;
            document.getElementById('chart-collection-fill').style.width = `${colPct}%`;
            
            document.getElementById('chart-pending-percent').textContent = `${penPct}%`;
            document.getElementById('chart-pending-fill').style.width = `${penPct}%`;
            
            document.getElementById('chart-cash-percent').textContent = `${cashPct}%`;
            document.getElementById('chart-cash-fill').style.width = `${cashPct}%`;
            
            document.getElementById('chart-qr-percent').textContent = `${qrPct}%`;
            document.getElementById('chart-qr-fill').style.width = `${qrPct}%`;

            // Render member personal payment history table
            const tbody = document.getElementById('member-payments-body');
            if (tbody) {
                tbody.innerHTML = '';
                const memberPayments = appState.payments.filter(p => p.member_id === member.member_id);
                if (memberPayments.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="3" class="text-center">${lang === 'ta' ? 'பதிவுகள் ஏதும் இல்லை...' : 'No payment records found...'}</td></tr>`;
                } else {
                    memberPayments.forEach(p => {
                        const tr = document.createElement('tr');
                        const modeLabel = p.payment_mode === 'Cash' 
                            ? (lang === 'ta' ? 'ரொக்கம்' : 'Cash') 
                            : (lang === 'ta' ? 'ஆன்லைன்' : 'Online Payment');
                        tr.innerHTML = `
                            <td data-label="${lang === 'ta' ? 'தேதி' : 'Date'}">${new Date(p.payment_date).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN')}</td>
                            <td data-label="${lang === 'ta' ? 'செலுத்திய தொகை' : 'Amount Paid'}" class="green-text">${formatCurrency(p.amount_paid)}</td>
                            <td data-label="${lang === 'ta' ? 'கட்டண முறை' : 'Payment Mode'}"><span class="status-badge status-online" style="background:rgba(212,175,55,0.1);color:var(--text-color);border:1px solid var(--border-color);">${modeLabel}</span></td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            }
        }

        // Update Quick Actions
        const quickActionsContainer = document.querySelector('.quick-actions-card .actions-list');
        if (quickActionsContainer) {
            quickActionsContainer.innerHTML = `
                <button class="action-btn" id="btn-member-go-qr"><i class="fa-solid fa-qrcode"></i> <span>${lang === 'ta' ? 'ஆன்லைன் கட்டணம் செலுத்த' : 'Pay Online via QR'}</span></button>
                <button class="action-btn" id="btn-member-go-gifts"><i class="fa-solid fa-gift"></i> <span>${lang === 'ta' ? 'பரிசுப் பொருட்கள் காண்க' : 'View Gift Items'}</span></button>
                <button class="action-btn" id="btn-member-go-contact"><i class="fa-solid fa-address-card"></i> <span>${lang === 'ta' ? 'நிர்வாகியைத் தொடர்பு கொள்ள' : 'Contact Owner'}</span></button>
            `;
            document.getElementById('btn-member-go-qr').addEventListener('click', () => switchView('qr-payment'));
            document.getElementById('btn-member-go-gifts').addEventListener('click', () => switchView('gift-items'));
            document.getElementById('btn-member-go-contact').addEventListener('click', () => switchView('contact'));
        }

    } else {
        // Restore Admin Card Styles & Stats
        if (cards[0]) {
            cards[0].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-users"></i>';
            cards[0].querySelector('.stats-label').textContent = i18n[lang].stat_members || 'மொத்த உறுப்பினர்கள்';
        }
        if (cards[1]) {
            cards[1].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-sack-dollar"></i>';
            cards[1].querySelector('.stats-label').textContent = i18n[lang].stat_collection || 'மொத்த சேகரிப்பு';
        }
        if (cards[2]) {
            cards[2].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>';
            cards[2].querySelector('.stats-label').textContent = i18n[lang].stat_pending || 'நிலுவைத் தொகை';
        }
        if (cards[3]) {
            cards[3].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-money-bill-wave"></i>';
            cards[3].querySelector('.stats-label').textContent = i18n[lang].stat_cash || 'ரொக்கக் கட்டணம் (Cash)';
        }
        if (cards[4]) {
            cards[4].querySelector('.stats-icon').innerHTML = '<i class="fa-solid fa-mobile-screen-button"></i>';
            cards[4].querySelector('.stats-label').textContent = i18n[lang].stat_qr || 'ஆன்லைன் கட்டணம் (UPI)';
        }

        const totalMembers = appState.members.length;
        let totalCollection = 0;
        let pendingCollection = 0;
        let cashCollection = 0;
        let qrCollection = 0;

        appState.payments.forEach(p => {
            const amt = parseFloat(p.amount_paid) || 0;
            totalCollection += amt;
            if (p.payment_mode === 'Cash') {
                cashCollection += amt;
            } else if (p.payment_mode === 'QR Payment' || p.payment_mode === 'Online Payment') {
                qrCollection += amt;
            }
        });

        appState.members.forEach(m => {
            pendingCollection += (parseFloat(m.pending_amount) || 0);
        });

        document.getElementById('stat-total-members').textContent = totalMembers;
        document.getElementById('stat-total-collection').textContent = formatCurrency(totalCollection);
        document.getElementById('stat-pending-collection').textContent = formatCurrency(pendingCollection);
        document.getElementById('stat-cash-collection').textContent = formatCurrency(cashCollection);
        document.getElementById('stat-qr-collection').textContent = formatCurrency(qrCollection);

        const totalPossible = totalCollection + pendingCollection;
        const colPct = totalPossible > 0 ? Math.round((totalCollection / totalPossible) * 100) : 0;
        const penPct = totalPossible > 0 ? Math.round((pendingCollection / totalPossible) * 100) : 0;
        const cashPct = totalCollection > 0 ? Math.round((cashCollection / totalCollection) * 100) : 0;
        const qrPct = totalCollection > 0 ? Math.round((qrCollection / totalCollection) * 100) : 0;

        document.getElementById('chart-collection-percent').textContent = `${colPct}%`;
        document.getElementById('chart-collection-fill').style.width = `${colPct}%`;
        
        document.getElementById('chart-pending-percent').textContent = `${penPct}%`;
        document.getElementById('chart-pending-fill').style.width = `${penPct}%`;
        
        document.getElementById('chart-cash-percent').textContent = `${cashPct}%`;
        document.getElementById('chart-cash-fill').style.width = `${cashPct}%`;
        
        document.getElementById('chart-qr-percent').textContent = `${qrPct}%`;
        document.getElementById('chart-qr-fill').style.width = `${qrPct}%`;

        // Update Quick Actions
        const quickActionsContainer = document.querySelector('.quick-actions-card .actions-list');
        if (quickActionsContainer) {
            quickActionsContainer.innerHTML = `
                <button class="action-btn" id="btn-quick-member"><i class="fa-solid fa-user-plus"></i> <span data-i18n="quick_member">${i18n[lang].quick_member}</span></button>
                <button class="action-btn" id="btn-quick-payment"><i class="fa-solid fa-money-bill-transfer"></i> <span data-i18n="quick_payment">${i18n[lang].quick_payment}</span></button>
                <button class="action-btn" id="btn-quick-qr"><i class="fa-solid fa-qrcode"></i> <span data-i18n="quick_qr">${i18n[lang].quick_qr}</span></button>
            `;
            document.getElementById('btn-quick-member').addEventListener('click', () => switchView('member-reg'));
            document.getElementById('btn-quick-payment').addEventListener('click', () => switchView('payment-mgmt'));
            document.getElementById('btn-quick-qr').addEventListener('click', () => switchView('qr-payment'));
        }
    }
}

function renderMembers(searchTerm = '') {
    const tbody = document.getElementById('members-table-body');
    tbody.innerHTML = '';

    const filtered = appState.members.filter(m => {
        const query = searchTerm.toLowerCase();
        return m.name.toLowerCase().includes(query) || 
               m.contact_no.includes(query) || 
               m.member_id.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center">${appState.language === 'ta' ? 'உறுப்பினர்கள் யாரும் இல்லை...' : 'No members registered yet...'}</td></tr>`;
        return;
    }

    filtered.forEach(m => {
        const tr = document.createElement('tr');
        const lang = appState.language || 'ta';
        tr.innerHTML = `
            <td data-label="${lang === 'ta' ? 'குறியீடு (ID)' : 'ID'}"><strong>${m.member_id}</strong></td>
            <td data-label="${lang === 'ta' ? 'பெயர்' : 'Name'}">${m.name}</td>
            <td data-label="${lang === 'ta' ? 'கைபேசி' : 'Contact'}">${m.contact_no}</td>
            <td data-label="${lang === 'ta' ? 'முகவரி' : 'Address'}">${m.address || '-'}</td>
            <td data-label="${lang === 'ta' ? 'சிட் தொகை' : 'Chit Value'}">${formatCurrency(m.chit_amount)}</td>
            <td data-label="${lang === 'ta' ? 'செலுத்தியது' : 'Paid'}" class="green-text">${formatCurrency(m.total_paid)}</td>
            <td data-label="${lang === 'ta' ? 'நிலுவை' : 'Pending'}" class="red-text">${formatCurrency(m.pending_amount)}</td>
            <td data-label="${lang === 'ta' ? 'வட்டி/லாபம்' : 'Interest'}" class="gold-text">${formatCurrency(m.interest_amount || 0)}</td>
            <td data-label="${lang === 'ta' ? 'செயல்பாடுகள்' : 'Actions'}" class="no-print" style="text-align: center;">
                <div class="row-actions">
                    <button class="btn-table-delete" data-id="${m.member_id}" title="${appState.language === 'ta' ? 'நீக்கு' : 'Delete'}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;

        tr.querySelector('.btn-table-delete').addEventListener('click', async (e) => {
            const memId = e.currentTarget.getAttribute('data-id');
            const confirmMsg = appState.language === 'ta'
                ? `உறுப்பினர் ${memId} மற்றும் அவரது அனைத்து தவணை வரவுகளையும் நீக்க வேண்டுமா?`
                : `Are you sure you want to delete member ${memId} and all associated payment logs?`;
            if (confirm(confirmMsg)) {
                try {
                    await DBService.deleteMember(memId);
                    showToast(appState.language === 'ta' ? 'உறுப்பினர் நீக்கப்பட்டார்!' : 'Member deleted!', 'success');
                    renderMembers();
                    populateMemberSelect();
                } catch (err) {
                    showToast((appState.language === 'ta' ? 'நீக்குவதில் தோல்வி: ' : 'Failed to delete: ') + err.message, 'danger');
                }
            }
        });

        tbody.appendChild(tr);
    });
}

function populateMemberSelect() {
    const select = document.getElementById('pay-member-select');
    const currentVal = select.value;

    select.innerHTML = `<option value="" disabled selected>${appState.language === 'ta' ? 'உறுப்பினரைத் தேர்ந்தெடுக்கவும்' : 'Select a member'}</option>`;
    
    appState.members.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.member_id;
        opt.textContent = `${m.name} (${m.member_id}) - ${formatCurrency(m.chit_amount)}`;
        select.appendChild(opt);
    });

    if (currentVal && appState.members.some(m => m.member_id === currentVal)) {
        select.value = currentVal;
    } else {
        document.getElementById('pay-member-info-box').classList.add('hidden');
    }
}

function renderPayments(modeFilter = 'All') {
    const tbody = document.getElementById('payments-table-body');
    tbody.innerHTML = '';

    const startDateVal = document.getElementById('filter-start-date').value;
    const endDateVal = document.getElementById('filter-end-date').value;

    let filtered = appState.payments;

    // Filter by payment mode (supports legacy QR Payment and new Online Payment)
    if (modeFilter !== 'All') {
        if (modeFilter === 'Online Payment' || modeFilter === 'QR Payment') {
            filtered = appState.payments.filter(p => p.payment_mode === 'Online Payment' || p.payment_mode === 'QR Payment');
        } else {
            filtered = appState.payments.filter(p => p.payment_mode === modeFilter);
        }
    }

    // Filter by date range
    if (startDateVal) {
        filtered = filtered.filter(p => p.payment_date >= startDateVal);
    }
    if (endDateVal) {
        filtered = filtered.filter(p => p.payment_date <= endDateVal);
    }

    // Calculate sum of filtered payments and update the total display badge
    const totalPeriodSum = filtered.reduce((sum, p) => sum + (parseFloat(p.amount_paid) || 0), 0);
    const filterTotalSumEl = document.getElementById('date-filter-total-sum');
    if (filterTotalSumEl) {
        filterTotalSumEl.textContent = formatCurrency(totalPeriodSum);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">${appState.language === 'ta' ? 'கட்டண வரலாறு காலியாக உள்ளது...' : 'Payment history is empty...'}</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const tr = document.createElement('tr');
        const memberName = p.members ? p.members.name : (appState.language === 'ta' ? 'நீக்கப்பட்ட உறுப்பினர்' : 'Deleted Member');
        const contact = p.members ? p.members.contact_no : '-';
        const chit = p.members ? formatCurrency(p.members.chit_amount) : '-';
        const modeLabel = p.payment_mode === 'Cash' 
            ? (appState.language === 'ta' ? 'ரொக்கம்' : 'Cash') 
            : (appState.language === 'ta' ? 'ஆன்லைன்' : 'Online Payment');
        
        const lang = appState.language || 'ta';
        tr.innerHTML = `
            <td data-label="${lang === 'ta' ? 'பெயர்' : 'Name'}"><strong>${memberName}</strong></td>
            <td data-label="${lang === 'ta' ? 'கைபேசி' : 'Contact'}">${contact}</td>
            <td data-label="${lang === 'ta' ? 'சிட் தொகை' : 'Chit Value'}">${chit}</td>
            <td data-label="${lang === 'ta' ? 'செலுத்திய தொகை' : 'Amount Paid'}" class="green-text">${formatCurrency(p.amount_paid)}</td>
            <td data-label="${lang === 'ta' ? 'கட்டண முறை' : 'Payment Mode'}"><span class="status-badge status-online" style="background:rgba(212,175,55,0.1);color:var(--text-color);border:1px solid var(--border-color);">${modeLabel}</span></td>
            <td data-label="${lang === 'ta' ? 'தேதி' : 'Date'}">${new Date(p.payment_date).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN')}</td>
            <td data-label="${lang === 'ta' ? 'செயல்பாடுகள்' : 'Actions'}" class="no-print" style="text-align: center;">
                <div class="row-actions">
                    <button class="btn-table-delete" data-id="${p.id}" data-member="${p.member_id}" title="${appState.language === 'ta' ? 'நீக்கு' : 'Delete'}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;

        tr.querySelector('.btn-table-delete').addEventListener('click', async (e) => {
            const payId = e.currentTarget.getAttribute('data-id');
            const memId = e.currentTarget.getAttribute('data-member');
            const confirmMsg = appState.language === 'ta' ? 'இக்கட்டண வரவை நீக்க வேண்டுமா?' : 'Are you sure you want to delete this payment log?';
            if (confirm(confirmMsg)) {
                try {
                    await DBService.deletePayment(payId, memId);
                    showToast(appState.language === 'ta' ? 'கட்டண வரவு நீக்கப்பட்டது!' : 'Payment record deleted!', 'success');
                    renderPayments(document.getElementById('filter-payment-mode').value);
                    if (document.getElementById('pay-member-select').value === memId) {
                        updatePaymentMemberInfo(memId);
                    }
                } catch (err) {
                    showToast((appState.language === 'ta' ? 'நீக்குவதில் தோல்வி: ' : 'Failed to delete: ') + err.message, 'danger');
                }
            }
        });

        tbody.appendChild(tr);
    });
}

function renderGifts(categoryFilter = 'All') {
    const container = document.getElementById('gift-cards-container');
    container.innerHTML = '';

    const filtered = appState.gifts.filter(g => {
        if (categoryFilter === 'All') return true;
        const parsed = parseGiftDescription(g.item_description);
        return parsed.category === categoryFilter;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted); font-weight: bold;">${appState.language === 'ta' ? 'பரிசுப் பொருட்கள் ஏதும் இல்லை...' : 'No gift items available...'}</div>`;
        return;
    }

    filtered.forEach(g => {
        const parsed = parseGiftDescription(g.item_description);
        const card = document.createElement('div');
        card.className = 'gift-card';
        
        let categoryLabel = appState.language === 'ta' ? 'இனிப்பு & காரம்' : 'Sweets & Savory';
        if (parsed.category === 'GoldSilver') categoryLabel = appState.language === 'ta' ? 'தங்கம் & வெள்ளி' : 'Gold & Silver';
        if (parsed.category === 'Crackers') categoryLabel = appState.language === 'ta' ? 'பட்டாசுகள்' : 'Festival Crackers';
        if (parsed.category === 'Groceries') categoryLabel = appState.language === 'ta' ? 'மளிகைப் பொருட்கள்' : 'Grocery Packs';

        let imgTag = '';
        if (g.item_image) {
            imgTag = `<img src="${g.item_image}" alt="${g.item_name}" class="gift-card-img">`;
        } else {
            imgTag = `
                <div class="gift-card-img" style="background:var(--maroon-dark);display:flex;align-items:center;justify-content:center;height:100%;color:var(--gold);">
                    <i class="fa-solid ${parsed.category === 'Sweets' ? 'fa-cookie-bite' : parsed.category === 'Crackers' ? 'fa-fire' : 'fa-blender'}" style="font-size:3.5rem;"></i>
                </div>
            `;
        }

        const isMember = appState.userRole === 'member';
        const actionsHtml = isMember ? '' : `
            <div class="gift-card-actions no-print">
                <button class="btn-table-edit btn-edit-gift" data-id="${g.id}" title="${appState.language === 'ta' ? 'திருத்து' : 'Edit'}"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-table-delete btn-delete-gift" data-id="${g.id}" title="${appState.language === 'ta' ? 'நீக்கு' : 'Delete'}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        card.innerHTML = `
            <div class="gift-card-img-box">
                ${imgTag}
                <span class="gift-card-badge">${categoryLabel}</span>
            </div>
            <div class="gift-card-content">
                <h4>${g.item_name}</h4>
                <p>${parsed.description || (appState.language === 'ta' ? 'விளக்கம் இல்லை.' : 'No description available.')}</p>
            </div>
            ${actionsHtml}
        `;

        if (!isMember) {
            card.querySelector('.btn-edit-gift').addEventListener('click', (e) => {
                const giftId = e.currentTarget.getAttribute('data-id');
                openEditGiftModal(giftId);
            });

            card.querySelector('.btn-delete-gift').addEventListener('click', async (e) => {
                const giftId = e.currentTarget.getAttribute('data-id');
                const confirmMsg = appState.language === 'ta' ? 'இப்பரிசுப் பொருளை நீக்க வேண்டுமா?' : 'Are you sure you want to delete this gift item?';
                if (confirm(confirmMsg)) {
                    try {
                        await DBService.deleteGift(giftId);
                        showToast(appState.language === 'ta' ? 'பரிசுப் பொருள் நீக்கப்பட்டது!' : 'Gift item deleted!', 'success');
                        renderGifts(document.querySelector('.gift-tab.active').getAttribute('data-category'));
                    } catch (err) {
                        showToast((appState.language === 'ta' ? 'நீக்குவதில் தோல்வி: ' : 'Failed to delete: ') + err.message, 'danger');
                    }
                }
            });
        }

        container.appendChild(card);
    });
}

function renderQRSettings() {
    const upi = appState.qrSettings.upi_id || 'vinaipriyan-2@okaxis';
    const name = appState.qrSettings.qr_name || 'vinai priyan';
    
    document.getElementById('dashboard-upi-id').textContent = upi;
    document.getElementById('dashboard-qr-name').textContent = name;
    
    // Fill settings inputs for admin
    const settingsUpiInput = document.getElementById('settings-upi-id');
    const settingsNameInput = document.getElementById('settings-qr-name');
    if (settingsUpiInput) settingsUpiInput.value = upi;
    if (settingsNameInput) settingsNameInput.value = name;
    
    const qrImg = document.getElementById('dashboard-qr-image');
    
    // If a custom uploaded QR image is present, use it. Otherwise generate dynamically.
    if (appState.qrSettings.qr_image && appState.qrSettings.qr_image.startsWith('data:image')) {
        qrImg.src = appState.qrSettings.qr_image;
    } else {
        const upiUrl = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}&cu=INR`;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
    }
}

function renderReports() {
    const totalMembers = appState.members.length;
    let totalCollection = 0;
    let pendingCollection = 0;
    let cashCollection = 0;
    let qrCollection = 0;

    appState.payments.forEach(p => {
        const amt = parseFloat(p.amount_paid) || 0;
        totalCollection += amt;
        if (p.payment_mode === 'Cash') {
            cashCollection += amt;
        } else if (p.payment_mode === 'QR Payment' || p.payment_mode === 'Online Payment') {
            qrCollection += amt;
        }
    });

    appState.members.forEach(m => {
        pendingCollection += (parseFloat(m.pending_amount) || 0);
    });

    const totalPossible = totalCollection + pendingCollection;

    document.getElementById('report-company-name').textContent = appState.appSettings.company_name;
    document.getElementById('report-company-address').textContent = appState.appSettings.company_address;
    document.getElementById('report-company-mobile').textContent = `${appState.language === 'ta' ? 'கைபேசி' : 'Mobile'}: ${appState.appSettings.company_mobile}`;
    document.getElementById('report-current-date').textContent = new Date().toLocaleDateString(appState.language === 'ta' ? 'ta-IN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('report-stat-members').textContent = totalMembers;
    document.getElementById('report-stat-collection').textContent = formatCurrency(totalCollection);
    document.getElementById('report-stat-pending').textContent = formatCurrency(pendingCollection);
    document.getElementById('report-stat-cash').textContent = formatCurrency(cashCollection);
    document.getElementById('report-stat-qr').textContent = formatCurrency(qrCollection);

    const chartHeight = 150; 
    const maxVal = Math.max(totalPossible, totalCollection, pendingCollection, qrCollection, 1); 

    function getBarHeight(val) {
        return Math.round((val / maxVal) * chartHeight);
    }

    const hTotal = getBarHeight(totalPossible);
    const hPaid = getBarHeight(totalCollection);
    const hPending = getBarHeight(pendingCollection);
    const hQR = getBarHeight(qrCollection);

    const barTotal = document.getElementById('svg-bar-total');
    barTotal.setAttribute('height', hTotal);
    barTotal.setAttribute('y', 180 - hTotal);

    const barPaid = document.getElementById('svg-bar-paid');
    barPaid.setAttribute('height', hPaid);
    barPaid.setAttribute('y', 180 - hPaid);

    const barPending = document.getElementById('svg-bar-pending');
    barPending.setAttribute('height', hPending);
    barPending.setAttribute('y', 180 - hPending);

    const barQR = document.getElementById('svg-bar-qr');
    barQR.setAttribute('height', hQR);
    barQR.setAttribute('y', 180 - hQR);

    const txtTotal = document.getElementById('svg-val-total');
    txtTotal.setAttribute('y', 170 - hTotal);
    txtTotal.textContent = formatCurrency(totalPossible);

    const txtPaid = document.getElementById('svg-val-paid');
    txtPaid.setAttribute('y', 170 - hPaid);
    txtPaid.textContent = formatCurrency(totalCollection);

    const txtPending = document.getElementById('svg-val-pending');
    txtPending.setAttribute('y', 170 - hPending);
    txtPending.textContent = formatCurrency(pendingCollection);

    const txtQR = document.getElementById('svg-val-qr');
    txtQR.setAttribute('y', 170 - hQR);
    txtQR.textContent = formatCurrency(qrCollection);
}

function renderContactPage() {
    // Static owner details are rendered directly in HTML
}

// ========================================================
// NAVIGATION ROUTER
// ========================================================
function switchView(viewName) {
    // Role based view security check
    const role = appState.userRole || 'admin';
    if (role === 'member' && ['member-reg', 'member-list', 'payment-mgmt', 'reports'].includes(viewName)) {
        viewName = 'dashboard';
    }

    // Close mobile sidebar drawer if it is open
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
    if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    document.querySelectorAll('.dashboard-view').forEach(view => {
        if (view.id === `view-${viewName}`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    appState.currentView = viewName;

    applyLanguage();

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'member-list') renderMembers();
    if (viewName === 'payment-mgmt') {
        populateMemberSelect();
        renderPayments(document.getElementById('filter-payment-mode').value);
    }
    if (viewName === 'gift-items') renderGifts();
    if (viewName === 'qr-payment') renderQRSettings();
    if (viewName === 'reports') renderReports();
    if (viewName === 'contact') renderContactPage();
}

function updatePaymentMemberInfo(memberId) {
    const infoBox = document.getElementById('pay-member-info-box');
    const member = appState.members.find(m => m.member_id === memberId);
    
    if (member) {
        document.getElementById('pay-info-chit-amount').textContent = formatCurrency(member.chit_amount);
        document.getElementById('pay-info-total-paid').textContent = formatCurrency(member.total_paid);
        document.getElementById('pay-info-pending').textContent = formatCurrency(member.pending_amount);
        document.getElementById('pay-info-interest').textContent = formatCurrency(member.interest_amount || 0);
        infoBox.classList.remove('hidden');
    } else {
        infoBox.classList.add('hidden');
    }
}

function openAddGiftModal() {
    document.getElementById('gift-edit-id').value = '';
    document.getElementById('add-gift-form').reset();
    document.getElementById('gift-img-preview-box').classList.add('hidden');
    document.getElementById('gift-img-preview').src = '';
    document.getElementById('add-gift-modal').classList.remove('hidden');
}

function openEditGiftModal(id) {
    const gift = appState.gifts.find(g => g.id === id);
    if (!gift) return;

    const parsed = parseGiftDescription(gift.item_description);
    
    document.getElementById('gift-edit-id').value = gift.id;
    document.getElementById('gift-name').value = gift.item_name;
    document.getElementById('gift-category').value = parsed.category;
    document.getElementById('gift-description').value = parsed.description;
    
    const previewBox = document.getElementById('gift-img-preview-box');
    const previewImg = document.getElementById('gift-img-preview');
    
    if (gift.item_image) {
        previewImg.src = gift.item_image;
        previewBox.classList.remove('hidden');
    } else {
        previewImg.src = '';
        previewBox.classList.add('hidden');
    }

    document.getElementById('add-gift-modal').classList.remove('hidden');
}

// ========================================================
// CORE APP INITIALIZATION & BOOTSTRAP
// ========================================================
async function initDemoMode() {
    appState.demoMode = true;
    appState.connectionStatus = false;
    
    DBService.loadDemoData();
    
    document.getElementById('setup-wizard-overlay').classList.add('hidden');
    updateConnectionBadge();
    updateSidebarBranding();
    switchView('dashboard');
    showToast('டெமோ பயன்முறை தொடங்கப்பட்டது (உள்ளூர் தரவுத்தளம்)!', 'warning');
}

async function initApp() {
    // Restoring role state from session cache
    if (AuthService.isLoggedIn()) {
        appState.userRole = localStorage.getItem('user_role') || 'admin';
        appState.currentUserContact = localStorage.getItem('user_contact');
    }

    // 1. First enforce Login authentication
    if (!AuthService.isLoggedIn()) {
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
        return;
    } else {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
    }

    // 2. Check if static env variables are configured (Client Mode / Handoff Mode)
    const hasEnvConfig = import.meta.env.VITE_SUPABASE_URL && 
                         !import.meta.env.VITE_SUPABASE_URL.includes('your-project-id') && 
                         import.meta.env.VITE_SUPABASE_ANON_KEY && 
                         !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-sb-anon-key');

    if (hasEnvConfig) {
        document.body.classList.add('client-mode');
    } else {
        document.body.classList.remove('client-mode');
    }

    // 3. Check if local demo mode is active
    if (localStorage.getItem('demo_mode') === 'true' && !hasEnvConfig) {
        initDemoMode();
        return;
    }

    // 4. Try loading Supabase credentials from Vite .env, fallback to LocalStorage
    const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabase_url');
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_key');

    // Check if empty or is a placeholder
    const isPlaceholder = !url || url.includes('your-project-id') || !key || key.includes('your-sb-anon-key');

    if (isPlaceholder) {
        if (!hasEnvConfig) {
            document.getElementById('setup-wizard-overlay').classList.remove('hidden');
        } else {
            showToast('Supabase இணைப்பு விவரங்கள் தவறாக உள்ளன!', 'danger');
        }
        updateConnectionBadge();
        return;
    }

    const initialized = DBService.initialize(url, key);
    if (!initialized) {
        showToast('Supabase Client-ஐ இயக்க முடியவில்லை!', 'danger');
        if (!hasEnvConfig) {
            document.getElementById('setup-wizard-overlay').classList.remove('hidden');
        }
        updateConnectionBadge();
        return;
    }

    appState.demoMode = false;
    const success = await DBService.loadAllData();
    updateConnectionBadge();

    if (success) {
        document.getElementById('setup-wizard-overlay').classList.add('hidden');
        updateSidebarBranding();
        switchView('dashboard');
        showToast('தரவுத்தளத்துடன் வெற்றிகரமாக இணைக்கப்பட்டது!', 'success');
    } else {
        showToast('Supabase இணைப்பு தவறியது! இணைய இணைப்பைச் சரிபார்க்கவும்.', 'danger');
        if (!hasEnvConfig) {
            document.getElementById('setup-wizard-overlay').classList.remove('hidden');
        } else {
            // If connection fails in client mode, let it stay on dashboard showing demo data or whatever is loaded
            updateSidebarBranding();
            switchView('dashboard');
        }
    }
}

// ========================================================
// EVENT LISTENERS BINDINGS
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Login Submit Handler
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        const success = await AuthService.login(email, password);
        if (success) {
            showToast('வெற்றிகரமாக உள்நுழைந்தீர்கள்!', 'success');
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            initApp();
        } else {
            showToast(appState.language === 'ta' ? 'விவரங்கள் தவறாக உள்ளன!' : 'Invalid email/mobile or password!', 'danger');
        }
    });

    // Sidebar Logout Click Handler
    document.getElementById('btn-sidebar-logout').addEventListener('click', () => {
        const confirmMsg = appState.language === 'ta' ? 'முகப்பிலிருந்து வெளியேற வேண்டுமா?' : 'Are you sure you want to logout?';
        if (confirm(confirmMsg)) {
            AuthService.logout();
            showToast('வெளியேறினீர்கள்!', 'success');
            initApp();
        }
    });

    // Wizard Logout Click Handler
    document.getElementById('btn-wizard-logout').addEventListener('click', () => {
        AuthService.logout();
        localStorage.removeItem('demo_mode');
        showToast('வெளியேறினீர்கள்!', 'success');
        initApp();
    });

    // Sidebar Connect Click Handler
    document.getElementById('btn-sidebar-connect').addEventListener('click', () => {
        const confirmMsg = appState.language === 'ta' ? 'டெமோ முறையை நிறுத்திவிட்டு, Supabase டேட்டாபேஸை இணைக்க விரும்புகிறீர்களா?' : 'Are you sure you want to stop demo mode and connect Supabase database?';
        if (confirm(confirmMsg)) {
            localStorage.removeItem('demo_mode');
            location.reload();
        }
    });
    
    // Sidebar Navigation Click Handlers
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.getAttribute('data-view');
            switchView(view);
        });
    });

    // Mobile Navigation & Toggle Event Handlers
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const sidebarCloseBtn = document.getElementById('btn-sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.remove('hidden');
        });
    }

    if (sidebarCloseBtn && sidebar && sidebarOverlay) {
        sidebarCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.add('hidden');
        });
    }

    if (sidebarOverlay && sidebar) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.add('hidden');
        });
    }

    // Mobile Language Toggle Event Handler
    const btnMobileLang = document.getElementById('btn-mobile-lang-toggle');
    if (btnMobileLang) {
        btnMobileLang.addEventListener('click', () => {
            appState.language = appState.language === 'ta' ? 'en' : 'ta';
            localStorage.setItem('app_lang', appState.language);
            applyLanguage();
            
            if (appState.currentView === 'dashboard') {
                renderDashboard();
            } else if (appState.currentView === 'member-list') {
                renderMembers();
            } else if (appState.currentView === 'payment-mgmt') {
                populateMemberSelect();
                renderPayments(document.getElementById('filter-payment-mode').value);
            }
        });
    }

    // Quick Action button redirects
    document.getElementById('btn-quick-member').addEventListener('click', () => switchView('member-reg'));
    document.getElementById('btn-quick-payment').addEventListener('click', () => switchView('payment-mgmt'));
    document.getElementById('btn-quick-qr').addEventListener('click', () => switchView('qr-payment'));

    // Member Registration Submit
    document.getElementById('member-registration-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const memberData = {
            name: document.getElementById('reg-member-name').value.trim(),
            contact_no: document.getElementById('reg-member-contact').value.trim(),
            chit_amount: parseFloat(document.getElementById('reg-member-chit-amount').value),
            interest_amount: parseFloat(document.getElementById('reg-member-interest').value) || 0,
            address: document.getElementById('reg-member-address').value.trim()
        };

        try {
            document.getElementById('btn-submit-member').disabled = true;
            await DBService.insertMember(memberData);
            showToast('உறுப்பினர் பதிவு வெற்றிகரமாக முடிந்தது!', 'success');
            
            document.getElementById('member-registration-form').reset();
            const nextId = await DBService.getNextMemberId();
            document.getElementById('reg-member-id').placeholder = `${nextId} (தானியங்கி)`;
            
            switchView('member-list');
        } catch (err) {
            showToast('பதிவு தோல்வியடைந்தது: ' + err.message, 'danger');
        } finally {
            document.getElementById('btn-submit-member').disabled = false;
        }
    });

    document.getElementById('btn-reset-member-form').addEventListener('click', async () => {
        document.getElementById('member-registration-form').reset();
        const nextId = await DBService.getNextMemberId();
        document.getElementById('reg-member-id').placeholder = `${nextId} (தானியங்கி)`;
    });

    // Search Member List Input
    document.getElementById('search-members').addEventListener('input', (e) => {
        renderMembers(e.target.value);
    });

    // Member table Print Toolbar
    document.getElementById('btn-print-members').addEventListener('click', () => {
        window.print();
    });

    // Payments: Member Selection Change
    document.getElementById('pay-member-select').addEventListener('change', (e) => {
        updatePaymentMemberInfo(e.target.value);
    });

    // Payment Log Submit
    document.getElementById('payment-entry-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const memberId = document.getElementById('pay-member-select').value;
        const amount = parseFloat(document.getElementById('pay-amount').value);
        const mode = document.getElementById('pay-mode').value;
        const date = document.getElementById('pay-date').value;

        if (!memberId) {
            showToast('உறுப்பினரைத் தேர்ந்தெடுக்கவும்!', 'warning');
            return;
        }

        const selectedMember = appState.members.find(m => m.member_id === memberId);
        if (amount > selectedMember.pending_amount) {
            showToast(`தவறு: நிலுவைத் தொகையை விட செலுத்தும் தொகை அதிகமாக உள்ளது (Max: ₹${selectedMember.pending_amount})`, 'danger');
            return;
        }

        try {
            document.getElementById('btn-submit-payment').disabled = true;
            await DBService.recordPayment(memberId, amount, mode, date);
            showToast('கட்டணம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!', 'success');
            
            document.getElementById('pay-amount').value = '';
            updatePaymentMemberInfo(memberId);
            renderPayments(document.getElementById('filter-payment-mode').value);
        } catch (err) {
            showToast('பதிவில் தோல்வி: ' + err.message, 'danger');
        } finally {
            document.getElementById('btn-submit-payment').disabled = false;
        }
    });

    // Filter Payment mode change
    document.getElementById('filter-payment-mode').addEventListener('change', (e) => {
        renderPayments(e.target.value);
    });

    // Filter Date Range changes
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    if (filterStartDate && filterEndDate) {
        filterStartDate.addEventListener('change', () => {
            renderPayments(document.getElementById('filter-payment-mode').value);
        });
        filterEndDate.addEventListener('change', () => {
            renderPayments(document.getElementById('filter-payment-mode').value);
        });
    }

    const btnClearDate = document.getElementById('btn-clear-date-filter');
    if (btnClearDate) {
        btnClearDate.addEventListener('click', () => {
            document.getElementById('filter-start-date').value = '';
            document.getElementById('filter-end-date').value = '';
            renderPayments(document.getElementById('filter-payment-mode').value);
        });
    }

    // Gift category tab switches
    document.querySelectorAll('.gift-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.gift-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            renderGifts(e.currentTarget.getAttribute('data-category'));
        });
    });

    // Gift modal triggers
    document.getElementById('btn-add-gift-modal-trigger').addEventListener('click', openAddGiftModal);
    document.getElementById('btn-close-gift-modal').addEventListener('click', () => {
        document.getElementById('add-gift-modal').classList.add('hidden');
    });
    document.getElementById('btn-cancel-gift-modal').addEventListener('click', () => {
        document.getElementById('add-gift-modal').classList.add('hidden');
    });

    // Gift modal submit (Insert / Update)
    document.getElementById('add-gift-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('gift-edit-id').value;
        const name = document.getElementById('gift-name').value.trim();
        const category = document.getElementById('gift-category').value;
        const description = document.getElementById('gift-description').value.trim();
        const previewImg = document.getElementById('gift-img-preview');
        const imgBase64 = previewImg.src.startsWith('data:image') ? previewImg.src : '';

        const giftPayload = { name, category, description, image: imgBase64 };

        try {
            document.getElementById('btn-save-gift-submit').disabled = true;
            if (id) {
                await DBService.updateGift(id, giftPayload);
                showToast('பரிசுப் பொருள் திருத்தப்பட்டது!', 'success');
            } else {
                await DBService.insertGift(giftPayload);
                showToast('புதிய பரிசுப் பொருள் சேர்க்கப்பட்டது!', 'success');
            }
            document.getElementById('add-gift-modal').classList.add('hidden');
            renderGifts(document.querySelector('.gift-tab.active').getAttribute('data-category'));
        } catch (err) {
            showToast('சேமிப்பதில் தோல்வி: ' + err.message, 'danger');
        } finally {
            document.getElementById('btn-save-gift-submit').disabled = false;
        }
    });

    // Gift image input file upload
    document.getElementById('gift-image-input').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                const previewImg = document.getElementById('gift-img-preview');
                previewImg.src = base64;
                document.getElementById('gift-img-preview-box').classList.remove('hidden');
            } catch (err) {
                showToast('படத்தை ஏற்றுவதில் பிழை!', 'danger');
            }
        }
    });

    // Admin QR Image upload handler
    let uploadedQRBase64 = '';
    const settingsQrImgInput = document.getElementById('settings-qr-image-input');
    if (settingsQrImgInput) {
        settingsQrImgInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    uploadedQRBase64 = await fileToBase64(file);
                    showToast(appState.language === 'ta' ? 'QR படம் பதிவேற்றப்பட்டது!' : 'QR image uploaded!', 'success');
                } catch (err) {
                    showToast(appState.language === 'ta' ? 'படத்தை ஏற்றுவதில் பிழை!' : 'Error loading image!', 'danger');
                }
            }
        });
    }

    // Admin QR Settings form submit handler
    const qrSettingsForm = document.getElementById('qr-settings-form');
    if (qrSettingsForm) {
        qrSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const upiId = document.getElementById('settings-upi-id').value.trim();
            const qrName = document.getElementById('settings-qr-name').value.trim();
            
            const payload = {
                ...appState.qrSettings,
                upi_id: upiId,
                qr_name: qrName
            };
            
            if (uploadedQRBase64) {
                payload.qr_image = uploadedQRBase64;
            }

            try {
                document.getElementById('btn-save-qr-settings').disabled = true;
                await DBService.saveQRSettings(payload);
                showToast(appState.language === 'ta' ? 'QR அமைப்புகள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!' : 'QR settings saved successfully!', 'success');
                renderQRSettings();
                uploadedQRBase64 = ''; // Reset cached base64
                if (settingsQrImgInput) settingsQrImgInput.value = ''; // Clear file input
            } catch (err) {
                showToast((appState.language === 'ta' ? 'சேமிப்பதில் தோல்வி: ' : 'Failed to save: ') + err.message, 'danger');
            } finally {
                document.getElementById('btn-save-qr-settings').disabled = false;
            }
        });
    }

    // Admin QR settings reset button handler
    const btnResetQRSettings = document.getElementById('btn-reset-qr-settings');
    if (btnResetQRSettings) {
        btnResetQRSettings.addEventListener('click', async () => {
            const confirmMsg = appState.language === 'ta' ? 'QR விவரங்களை துவக்க நிலைக்கு மீட்டமைக்க வேண்டுமா?' : 'Are you sure you want to reset QR settings to default?';
            if (confirm(confirmMsg)) {
                try {
                    const defaultPayload = {
                        ...appState.qrSettings,
                        upi_id: 'vinaipriyan-2@okaxis',
                        qr_name: 'vinai priyan',
                        qr_image: '/default_qr.jpg'
                    };
                    await DBService.saveQRSettings(defaultPayload);
                    showToast(appState.language === 'ta' ? 'QR படம் துவக்க நிலைக்கு மாற்றப்பட்டது.' : 'QR image reset to default.', 'success');
                    renderQRSettings();
                    uploadedQRBase64 = '';
                    if (settingsQrImgInput) settingsQrImgInput.value = '';
                } catch (err) {
                    showToast((appState.language === 'ta' ? 'மீட்டமைப்பில் தோல்வி: ' : 'Failed to reset: ') + err.message, 'danger');
                }
            }
        });
    }

    // QR Download
    document.getElementById('btn-download-qr').addEventListener('click', () => {
        const qrImg = document.getElementById('dashboard-qr-image');
        const link = document.createElement('a');
        link.href = qrImg.src;
        link.download = `${appState.qrSettings.qr_name || 'vinai-priyan'}-QR.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('QR பதிவிறக்கம் தொடங்கப்பட்டது...', 'success');
    });

    // Copy UPI ID
    document.getElementById('btn-copy-upi').addEventListener('click', () => {
        const upiText = document.getElementById('dashboard-upi-id').textContent;
        navigator.clipboard.writeText(upiText).then(() => {
            showToast(appState.language === 'ta' ? 'UPI ID வெற்றிகரமாக நகலெடுக்கப்பட்டது!' : 'UPI ID copied to clipboard!', 'success');
        }).catch(err => {
            showToast(appState.language === 'ta' ? 'நகலெடுப்பதில் தோல்வி!' : 'Failed to copy!', 'danger');
        });
    });

    // Reports PDF / Print Download trigger
    document.getElementById('btn-print-report').addEventListener('click', () => {
        window.print();
    });
    document.getElementById('btn-download-pdf-report').addEventListener('click', () => {
        window.print();
    });

    // Members PDF / Print Download trigger
    const btnDownloadPdfMembers = document.getElementById('btn-download-pdf-members');
    if (btnDownloadPdfMembers) {
        btnDownloadPdfMembers.addEventListener('click', () => {
            window.print();
        });
    }

    // Setup Wizard Form: Save and Proceed
    document.getElementById('wizard-config-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = document.getElementById('wiz-supabase-url').value.trim();
        const key = document.getElementById('wiz-supabase-key').value.trim();

        const connected = await DBService.testConnection(url, key);
        if (connected) {
            localStorage.removeItem('demo_mode');
            localStorage.setItem('supabase_url', url);
            localStorage.setItem('supabase_key', key);
            
            initApp();
        } else {
            showToast('இணைப்பு தோல்வியடைந்தது! URL அல்லது Key-ஐ சரிபார்க்கவும்.', 'danger');
        }
    });

    // Wizard: Demo Mode click
    document.getElementById('btn-wizard-demo').addEventListener('click', () => {
        localStorage.setItem('demo_mode', 'true');
        initDemoMode();
    });

    // Wizard Connection test
    document.getElementById('btn-wizard-test-connection').addEventListener('click', async () => {
        const url = document.getElementById('wiz-supabase-url').value.trim();
        const key = document.getElementById('wiz-supabase-key').value.trim();
        
        if (!url || !key) {
            showToast('அனைத்து விவரங்களையும் உள்ளிடவும்!', 'warning');
            return;
        }

        showToast('இணைப்பை சோதிக்கிறது...', 'warning');
        const connected = await DBService.testConnection(url, key);
        
        const badge = document.getElementById('wizard-connection-status');
        const statusText = document.getElementById('wizard-status-text');

        if (connected) {
            badge.className = 'status-badge status-online';
            statusText.textContent = '🟢 Success Connected!';
            showToast('Supabase இணைப்பு சோதிக்கப்பட்டு வெற்றிகரமாக முடிந்தது!', 'success');
        } else {
            badge.className = 'status-badge status-offline';
            statusText.textContent = '🔴 Failed Connection';
            showToast('இணைப்பு சோதிப்பு தவறியது!', 'danger');
        }
    });
    // Default Date fields in payment forms
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pay-date').value = today;

    // Language Toggle Event Handler
    document.getElementById('btn-lang-toggle').addEventListener('click', () => {
        appState.language = appState.language === 'ta' ? 'en' : 'ta';
        localStorage.setItem('app_lang', appState.language);
        applyLanguage();
        
        // Refresh the current view to apply language changes to dynamic contents
        if (appState.currentView === 'dashboard') {
            renderDashboard();
        } else if (appState.currentView === 'member-list') {
            renderMembers();
        } else if (appState.currentView === 'payment-mgmt') {
            populateMemberSelect();
            renderPayments(document.getElementById('filter-payment-mode').value);
        } else if (appState.currentView === 'gift-items') {
            renderGifts(document.querySelector('.gift-tab.active').getAttribute('data-category'));
        } else if (appState.currentView === 'qr-payment') {
            renderQRSettings();
        } else if (appState.currentView === 'reports') {
            renderReports();
        } else if (appState.currentView === 'contact') {
            renderContactPage();
        }
    });

    // Initialize saved language setting
    appState.language = localStorage.getItem('app_lang') || 'ta';
    applyLanguage();

    // Theme Toggle Logic
    const initTheme = () => {
        const savedTheme = localStorage.getItem('app_theme') || 'light';
        setTheme(savedTheme);

        const btnThemeToggle = document.getElementById('btn-theme-toggle');
        const btnMobileThemeToggle = document.getElementById('btn-mobile-theme-toggle');

        const toggleFn = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        };

        if (btnThemeToggle) btnThemeToggle.addEventListener('click', toggleFn);
        if (btnMobileThemeToggle) btnMobileThemeToggle.addEventListener('click', toggleFn);
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app_theme', theme);
        
        // Update theme toggle icons (moon for light theme, sun for dark theme)
        const iconClass = theme === 'light' ? 'fa-moon' : 'fa-sun';
        const btnThemeToggle = document.getElementById('btn-theme-toggle');
        const btnMobileThemeToggle = document.getElementById('btn-mobile-theme-toggle');
        
        if (btnThemeToggle) {
            btnThemeToggle.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
        }
        if (btnMobileThemeToggle) {
            btnMobileThemeToggle.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
        }
    };

    initTheme();

    // Bootstrap
    initApp();
});
