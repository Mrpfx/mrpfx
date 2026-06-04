/**
 * MRPFX Backend API Types
 * Generated from OpenAPI specification
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface SignupRequest {
    email: string;
    password: string;
    username: string;
    display_name?: string | null;
}

export interface LoginRequest {
    login: string; // Email or username
    password: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface UserResponse {
    ID: number;
    user_login: string;
    user_nicename: string;
    user_email: string;
    user_url: string;
    user_registered: string;
    user_status: number;
    display_name: string | null;
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface ResendVerificationRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    new_password: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
}

export interface MessageResponse {
    message: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

// ============================================================================
// WORDPRESS USER TYPES
// ============================================================================

export interface WPUserRead {
    ID: number;
    user_login: string;
    user_email: string;
    user_nicename?: string | null;
    user_url?: string | null;
    display_name?: string | null;
    user_status: number;
    user_registered: string;
    roles?: string[];
}

export interface WPUserCreate {
    user_login: string;
    user_email: string;
    user_pass: string;
    user_nicename?: string | null;
    user_url?: string | null;
    display_name?: string | null;
    user_status?: number;
}

export interface WPUserUpdate {
    user_nicename?: string | null;
    user_email?: string | null;
    user_url?: string | null;
    display_name?: string | null;
    user_status?: number | null;
    user_pass?: string | null;
}

// ============================================================================
// WOOCOMMERCE ORDER TYPES
// ============================================================================

export interface WCOrder {
    id: number | null;
    status?: string | null;
    currency?: string | null;
    type?: string | null;
    tax_amount?: string | null;
    total_amount?: string | null;
    customer_id?: number | null;
    billing_email?: string | null;
    date_created_gmt?: string | null;
    date_updated_gmt?: string | null;
    parent_order_id?: number | null;
    payment_method?: string | null;
    payment_method_title?: string | null;
    transaction_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    customer_note?: string | null;
}

export interface WCOrderAddress {
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    address_1?: string | null;
    address_2?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: string | null;
    email?: string | null;
    phone?: string | null;
}

export interface WCOrderItemRead {
    order_item_id: number;
    order_item_name: string;
    order_item_type: string;
    order_id: number;
    product_id?: number;
    quantity?: number;
    total?: string;
    line_total?: string;
    meta?: Record<string, string> | null;
}

export interface WCOrderFull extends WCOrder {
    billing_address?: WCOrderAddress | null;
    shipping_address?: WCOrderAddress | null;
    items: WCOrderItemRead[];
}

export interface WCOrderCreate {
    status?: string | null;
    currency?: string | null;
    total_amount?: number | string | null;
    customer_id?: number | null;
    billing_email?: string | null;
    payment_method?: string | null;
    payment_method_title?: string | null;
}

export interface WCOrderUpdate {
    status?: string | null;
    total_amount?: number | string | null;
    billing_email?: string | null;
}

export interface WCOrderRead {
    id: number;
    status?: string | null;
    currency?: string | null;
    total_amount?: string | null;
    customer_id?: number | null;
    billing_email?: string | null;
    payment_method?: string | null;
    payment_method_title?: string | null;
    date_created_gmt?: string | null;
    date_updated_gmt?: string | null;
}

// ============================================================================
// WOOCOMMERCE PRODUCT TYPES
// ============================================================================

export interface WCProductAttributeRead {
    id: number;
    name: string;
    slug?: string | null;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
}

export interface WCProductAddonField {
    name: string;
    type: string;
    description: string;
    required: boolean;
    position: number;
    options: string[];
    placeholder?: string | null;
    max_length?: number | null;
}

export interface WCProductAddonsRead {
    product_id: number;
    addons: WCProductAddonField[];
}

export interface WCProductVariationRead {
    id: number;
    sku?: string | null;
    price?: string | null;
    regular_price?: string | null;
    sale_price?: string | null;
    stock_quantity?: number | null;
    stock_status?: string | null;
    manage_stock: boolean;
    weight?: string | null;
    dimensions?: { length: string | null; width: string | null; height: string | null; } | null;
    attributes: { name: string; option: string; }[];
    image?: { id: number; src: string; name: string; alt: string; } | null;
    date_created?: string | null;
    date_modified?: string | null;
    description?: string | null;
    status?: string | null;
}

export interface WCProductVariationCreate {
    sku?: string | null;
    regular_price?: string | null;
    sale_price?: string | null;
    price?: string | null;
    stock_quantity?: number | null;
    stock_status?: string | null;
    manage_stock?: boolean;
    weight?: string | null;
    attributes: { name: string; option: string; }[];
    description?: string | null;
    status?: string | null;
}

// --- Traders ---
export interface TraderPerformanceRecord {
    month: string;
    winRate: string;
    monthlyRoi: string;
    maxDrawdown: string;
    totalTrades: string;
}

export interface TraderInfo {
    trader_id: string;
    name: string;
    type: string;
    strategy: string;
    description?: string;
    profitFactor: string;
    avgTradeDuration: string;
    bestTrade: string;
    worstTrade: string;
}

export interface TraderPerformanceResponse extends TraderInfo {
    performance: TraderPerformanceRecord[];
}

export interface WCProductVariationUpdate {
    sku?: string | null;
    regular_price?: string | null;
    sale_price?: string | null;
    price?: string | null;
    stock_quantity?: number | null;
    stock_status?: string | null;
    manage_stock?: boolean;
    weight?: string | null;
    attributes?: { name: string; option: string; }[];
    description?: string | null;
    status?: string | null;
}

export interface WCProductRead {
    id: number;
    name: string;
    slug: string;
    type: 'simple' | 'variable' | 'variable-subscription' | 'grouped' | 'external';
    sku?: string | null;
    price?: string | null;
    regular_price?: string | null;
    sale_price?: string | null;
    description?: string | null;
    short_description?: string | null;
    status?: string | null;
    stock_quantity?: number | null;
    stock_status?: string | null;
    virtual?: boolean | null;
    downloadable?: boolean | null;
    images?: { id: number; src: string; name: string; alt: string; }[];
    featured_image?: WPFeaturedImage | null;
    gallery_images?: WPFeaturedImage[];
    date_created?: string | null;
    date_modified?: string | null;
    average_rating?: string | null;
    rating_count?: number | null;
    total_sales?: number | null;
    seller_payment_link?: string | null;
    whop_payment_link?: string | null;
    signal_link?: string | null;
    telegram_link?: string | null;
    vip_group?: string | null;
    addons?: WCProductAddonField[] | null;
}

export interface WCProductFullRead extends WCProductRead {
    attributes: WCProductAttributeRead[];
    variations: WCProductVariationRead[];
    addons?: WCProductAddonField[];
    categories: WPTerm[];
    tags: WPTerm[];
    related_ids?: number[];
    upsell_ids?: number[];
    cross_sell_ids?: number[];
}

export interface WCProductCreate {
    name: string;
    type?: 'simple' | 'variable' | 'variable-subscription' | 'grouped' | 'external';
    sku?: string | null;
    price?: number | string | null;
    regular_price?: number | string | null;
    sale_price?: number | string | null;
    description?: string | null;
    short_description?: string | null;
    status?: string | null;
    stock_quantity?: number | null;
    stock_status?: string | null;
    virtual?: boolean | null;
    downloadable?: boolean | null;
    images?: { id: number; src: string; name: string; alt: string; }[];
    featured_image?: WPFeaturedImage | null;
    slug?: string;
    addons?: WCProductAddonField[];
    seller_payment_link?: string | null;
    whop_payment_link?: string | null;
    signal_link?: string | null;
    telegram_link?: string | null;
    vip_group?: string | null;
}

export interface WCProductUpdate {
    name?: string | null;
    type?: 'simple' | 'variable' | 'variable-subscription' | 'grouped' | 'external';
    sku?: string | null;
    price?: number | string | null;
    regular_price?: number | string | null;
    sale_price?: string | null;
    description?: string | null;
    short_description?: string | null;
    status?: string | null;
    stock_quantity?: number | null;
    stock_status?: string | null;
    virtual?: boolean | null;
    downloadable?: boolean | null;
    images?: { id: number; src: string; name: string; alt: string; }[];
    slug?: string;
    seller_payment_link?: string | null;
    whop_payment_link?: string | null;
    signal_link?: string | null;
    telegram_link?: string | null;
    vip_group?: string | null;
    addons?: WCProductAddonField[];
}

export interface WCProductMeta {
    product_id: number;
    sku?: string | null;
    virtual: boolean;
    downloadable: boolean;
    min_price?: string | null;
    max_price?: string | null;
    onsale: boolean;
    stock_quantity?: number | null;
    stock_status?: string | null;
    rating_count: number;
    average_rating?: string | null;
    total_sales: number;
    tax_status?: string | null;
    tax_class?: string | null;
}

export interface WCProductReviewCreate {
    rating: number; // 1-5
    review: string;
}

// ============================================================================
// WOOCOMMERCE CART TYPES
// ============================================================================

export interface WCAddToCartRequest {
    product_id: number;
    variation_id?: number | null;
    quantity?: number;
    custom_fields?: Record<string, string>;
}

export interface WCUpdateCartItemRequest {
    product_id: number;
    variation_id?: number | null;
    quantity: number;
}

export interface WCApplyCouponRequest {
    coupon_code: string;
}

export interface WCCoupon {
    id: number;
    code: string;
    amount: string;
    date_created?: string;
    date_modified?: string;
    discount_type: 'percent' | 'fixed_cart' | 'fixed_product';
    description?: string;
    date_expires?: string | null;
    usage_count?: number;
    individual_use?: boolean;
    product_ids?: number[];
    excluded_product_ids?: number[];
    usage_limit?: number | null;
    usage_limit_per_user?: number | null;
    free_shipping?: boolean;
    product_categories?: number[];
    excluded_product_categories?: number[];
    exclude_sale_items?: boolean;
    minimum_amount?: string;
    maximum_amount?: string;
    email_restrictions?: string[];
}

export interface WCCouponUpdate extends Partial<Omit<WCCoupon, 'id' | 'date_created' | 'date_modified' | 'usage_count'>> { }

export interface WCCartItem {
    product_id: number;
    variation_id?: number | null;
    quantity: number;
    product_name: string;
    product_price: number;
    line_total: number;
    product_image?: string | null;
    custom_fields?: Record<string, string>;
}

export interface WCCart {
    user_id: number;
    items: WCCartItem[];
    subtotal: number;
    discount_total: number;
    shipping_total: number;
    tax_total: number;
    total: number;
    item_count: number;
    coupon_codes: string[];
}

// ============================================================================
// WOOCOMMERCE CHECKOUT TYPES
// ============================================================================

export interface WCAddress {
    first_name: string;
    last_name: string;
    company?: string | null;
    address_1: string;
    address_2?: string | null;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email?: string | null;
    phone?: string | null;
}

export interface WCCheckoutRequest {
    billing_address: WCAddress;
    shipping_address?: WCAddress | null;
    use_same_for_shipping?: boolean;
    payment_method: string;
    payment_method_title?: string | null;
    customer_note?: string | null;
    shipping_method?: string | null;
    coupon_codes?: string[];
    custom_fields?: Record<string, string>;
}

export interface WCCheckoutResponse {
    order_id: number;
    order_key: string;
    order_status: string;
    total: string;
    payment_url?: string | null;
    redirect_url?: string | null;
    message: string;
}

// ============================================================================
// WOOCOMMERCE CUSTOMER TYPES
// ============================================================================

export interface WCCustomerLookup {
    customer_id?: number | null;
    user_id?: number | null;
    username: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    date_last_active?: string | null;
    date_registered?: string | null;
    country: string;
    postcode: string;
    city: string;
    state: string;
}

export interface WCUserOrderSummary {
    total_orders: number;
    total_spent: string;
    pending_orders: number;
    processing_orders: number;
    completed_orders: number;
}

// ============================================================================
// LEARNPRESS TYPES
// ============================================================================

export interface LPCourseMetadata {
    price?: number | null;
    duration?: string | null;
    level?: string | null;
    students?: number | null;
    instructor_name?: string | null;
}

export interface LPCourse {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    date_created: string;
    status: string; // Added status
    metadata: LPCourseMetadata;
}

export interface LPCourseCreate {
    title: string;
    content?: string;
    excerpt?: string;
    status?: string;
    price?: number;
    duration?: string;
    level?: string;
    students?: number;
    slug?: string;
}

export interface LPCourseUpdate {
    title?: string | null;
    content?: string | null;
    excerpt?: string | null;
    status?: string | null;
    price?: number | null;
    duration?: string | null;
    level?: string | null;
    students?: number | null;
    slug?: string | null;
}

export interface LPItem {
    id: number;
    title: string;
    type: string; // 'lp_lesson' or 'lp_quiz'
    duration?: string | null;
    preview: boolean;
    content?: string | null;
}

export interface LPItemCreate {
    title: string;
    content?: string;
    type?: string;
    duration?: string;
    preview?: boolean;
    passing_grade?: number;
}

export interface LPItemUpdate {
    title?: string | null;
    content?: string | null;
    type?: string | null;
    duration?: string | null;
    preview?: boolean | null;
    passing_grade?: number | null;
}

export interface LPSection {
    id: number;
    title: string;
    order: number;
    description?: string | null;
    items: LPItem[];
}

export interface LPSectionCreate {
    title: string;
    description?: string;
    order?: number;
}

export interface LPSectionUpdate {
    title?: string | null;
    description?: string | null;
    order?: number | null;
}

export interface LPCurriculum {
    course_id: number;
    sections: LPSection[];
}

export interface LPQuestionOption {
    value: string;
    title: string;
    is_true: boolean;
}

export interface LPQuestion {
    id: number;
    title: string;
    content?: string | null;
    type: string;
    options: LPQuestionOption[];
}

export interface LPQuestionCreate {
    title: string;
    content?: string;
    type?: string;
    options: LPQuestionOption[];
}

export interface LPQuestionUpdate {
    title?: string | null;
    content?: string | null;
    type?: string | null;
    options?: LPQuestionOption[] | null;
}

export interface LPQuiz {
    id: number;
    title: string;
    content: string;
    duration?: string | null;
    passing_grade?: number | null;
    questions: LPQuestion[];
}

export interface LPQuizSubmission {
    question_id: number;
    answer_value: string;
}

export interface LPQuizSubmitRequest {
    quiz_id: number;
    course_id: number;
    answers: LPQuizSubmission[];
}

export interface LPEnrollRequest {
    course_id: number;
}

export interface LPCompleteItemRequest {
    item_id: number;
    course_id: number;
}

export interface LPUserItem {
    user_item_id?: number | null;
    user_id: number;
    item_id: number;
    start_time?: string | null;
    end_time?: string | null;
    item_type: string;
    status: string;
    graduation?: string | null;
    access_level: number;
    ref_id: number;
    ref_type?: string | null;
    parent_id: number;
}

export interface LPLearner {
    user_id: number;
    username: string;
    display_name: string;
    email: string;
    enrollment_date: string;
    status: 'enrolled' | 'completed';
    graduation: 'in-progress' | 'passed' | 'failed';
    progress_percent: number;
}

export interface LPCourseStats {
    total_students: number;
    completed_students: number;
    in_progress_students: number;
    passing_rate: number;
    average_quiz_score: number;
}

export interface LPQuizSubmissionRead {
    id: number;
    quiz_id: number;
    course_id: number;
    user_id: number;
    user_name: string;
    user_display_name: string;
    start_time: string;
    end_time: string;
    status: string;
    result: {
        mark: number;
        user_mark: number;
        minus_point: number;
        question_count: number;
        question_completed: number;
        question_correct: number;
        question_wrong: number;
        question_empty: number;
        time_spend: string;
        passing_grade: string;
    };
    answers?: {
        question_id: number;
        question_title: string;
        answer_value: any;
        correct?: boolean;
        mark?: number;
    }[];
}

export interface LPMyProgress {
    user_id: number;
    username: string;
    display_name: string;
    email: string;
    enrollment_date: string;
    status: string;
    graduation: string;
    progress_percent: number;
}

export interface LPQuizResult {
    user_item_id: number;
    quiz_id: number;
    user_display_name: string;
    status: string;
    graduation: string;
    results: {
        user_mark: number;
        question_count: number;
        user_score: number;
        passing_grade: number;
        passed: boolean;
    };
}

// ============================================================================
// SWPM MEMBER TYPES
// ============================================================================

export interface SWPMMemberRead {
    member_id: number;
    user_name: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    membership_level: number;
    account_state?: string | null;
    company_name?: string | null;
    member_since: string;
    last_accessed: string;
}

export interface SWPMMemberCreate {
    user_name: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    membership_level: number;
    account_state?: string | null;
    company_name?: string | null;
    password: string;
}

export interface SWPMMemberUpdate {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    membership_level?: number | null;
    account_state?: string | null;
    password?: string | null;
}

export interface WPFeaturedImage {
    id: number;
    title: string;
    url: string;
    alt_text: string;
    caption: string;
    mime_type: string;
    date_created: string;
}

// ============================================================================
// WORDPRESS CONTENT TYPES
// ============================================================================

export interface WPPostRead {
    ID: number;
    post_author: number;
    post_title: string;
    post_content: string;
    post_excerpt: string;
    post_status: string;
    post_type: string;
    post_parent: number;
    menu_order: number;
    comment_status: string;
    ping_status: string;
    post_date: string;
    post_date_gmt: string;
    post_modified: string;
    post_modified_gmt: string;
    post_name: string;
    guid?: string | null;
    comment_count: number;
    featured_media?: number;
    featured_image?: WPFeaturedImage | null;
    // Standard WP REST API fields for convenience
    title?: { rendered: string };
    content?: { rendered: string; protected: boolean };
    excerpt?: { rendered: string; protected: boolean };
    slug?: string;
}

export interface WPTerm {
    term_id: number;
    name: string;
    slug: string;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    term_taxonomy_id: number;
}

export interface WPPostFull extends WPPostRead {
    categories: WPTerm[];
    tags: WPTerm[];
}

export interface WPPostCreate {
    post_title: string;
    post_content?: string;
    post_excerpt?: string;
    post_status?: string;
    post_type?: string;
    post_parent?: number;
    menu_order?: number;
    comment_status?: string;
    ping_status?: string;
    post_name?: string;
}

export interface WPPostUpdate {
    post_title?: string;
    post_content?: string;
    post_excerpt?: string;
    post_status?: string;
    post_name?: string;
    post_parent?: number;
    menu_order?: number;
    comment_status?: string;
    ping_status?: string;
}

export interface WPCategory {
    term_id: number;
    name: string;
    slug: string;
    taxonomy: string;
    description?: string | null;
    parent: number;
    count: number;
}

export interface WPTag {
    term_id: number;
    name: string;
    slug: string;
    taxonomy: string;
    description?: string | null;
    count: number;
}

export interface WPPostMetaRead {
    meta_id: number;
    post_id: number;
    meta_key: string;
    meta_value?: string | null;
}

export interface WPPostWithTerms extends WPPostRead {
    categories: WPCategory[];
    tags: WPTag[];
    meta: WPPostMetaRead[];
}

export interface WPCommentRead {
    comment_ID: number;
    comment_post_ID: number;
    comment_author?: string | null;
    comment_author_email?: string | null;
    comment_author_url?: string | null;
    comment_content: string;
    comment_date: string;
    comment_date_gmt: string;
    comment_approved: string;
    comment_parent: number;
    user_id: number;
    comment_karma: number;
    comment_author_IP?: string | null;
    comment_agent?: string | null;
    comment_type?: string | null;
    post_title?: string | null;
    meta?: WPCommentMeta[];
}

export interface WPCommentMeta {
    meta_id: number;
    comment_id: number;
    meta_key: string;
    meta_value?: string | null;
}

export interface WPCommentCreate {
    comment_content: string;
    comment_post_ID: number;
    comment_author?: string | null;
    comment_author_email?: string | null;
    comment_author_url?: string | null;
    comment_parent?: number | null;
    user_id?: number | null;
}

export interface WPCommentUpdate {
    comment_content?: string | null;
    comment_approved?: string | null;
}

// ============================================================================
// HTTP ERROR TYPES
// ============================================================================

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface HTTPValidationError {
    detail: ValidationError[];
}

// ============================================================================
// SECURITY TYPES
// ============================================================================

export interface BlockedIP {
    id: number;
    ip: string;
    reason: string;
    blocked_at: string;
    expires_at?: string | null;
}

export interface BlockIPRequest {
    ip: string;
    reason?: string;
    duration?: string; // e.g., 'permanent', '24h'
}

export interface LoginAttempt {
    id: number;
    ip: string;
    username: string;
    status: 'success' | 'failed';
    user_agent?: string;
    timestamp: string;
}

export interface SecurityIssue {
    id: number;
    type: string;
    severity: number; // 1-10 or similar
    status: 'new' | 'ignored' | 'fixed';
    description: string;
    details?: any;
    created_at: string;
}

export interface UpdateIssueRequest {
    status: 'new' | 'ignored' | 'fixed';
}

export interface SecurityEvent {
    id: number;
    type: string;
    message: string;
    level: string;
    timestamp: string;
    ip?: string;
}

export interface TrafficHit {
    id: number;
    ip: string;
    url: string;
    status_code: number;
    user_agent?: string;
    timestamp: string;
    is_attack: boolean;
}

// ============================================================================
// SEO TYPES (Yoast)
// ============================================================================

export interface SEOIndexable {
    id: number;
    object_id: number;
    object_type: string;
    object_sub_type?: string;
    permalink?: string;
    title?: string;
    description?: string;
    is_robots_noindex?: boolean;
    open_graph_title?: string;
    open_graph_description?: string;
    open_graph_image?: string;
    open_graph_image_id?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    twitter_image_id?: string;
}

export interface UpdateSEORequest {
    title?: string;
    description?: string;
    is_robots_noindex?: boolean;
    open_graph_title?: string;
    open_graph_description?: string;
    open_graph_image_id?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image_id?: string;
}

export interface SEORedirect {
    id: number;
    url: string;
    target: string;
    type: number; // 301, 302, etc.
    format: string; // 'plain', 'regex'
    status: 'enabled' | 'disabled';
}

export interface CreateRedirectRequest {
    url: string;
    target: string;
    type?: number;
    format?: string;
}

export interface UpdateRedirectRequest {
    url?: string;
    target?: string;
    type?: number;
    format?: string;
    status?: 'enabled' | 'disabled';
}

export interface SEORedirectLog {
    id: number;
    redirect_id: number;
    ip: string;
    user_agent?: string;
    timestamp: string;
}

export interface SEO404Error {
    id: number;
    url: string;
    hits: number;
    last_accessed: string;
}

// ============================================================================
// MARKETING TYPES (Hustle, etc.)
// ============================================================================

export interface MarketingModule {
    id: number;
    type: 'popup' | 'slidein' | 'embed' | 'social_share';
    name: string;
    status: 'active' | 'inactive';
    views: number;
    conversions: number;
    conversion_rate: string;
}

export interface MarketingModuleStats {
    views: number;
    conversions: number;
    last_conversion?: string;
}

export interface MarketingEntry {
    id: number;
    module_id: number;
    email: string;
    name?: string;
    custom_fields?: Record<string, any>;
    submitted_at: string;
    ip?: string;
}

export interface MarketingLead {
    id: number;
    email: string;
    name?: string;
    source: string;
    status: 'unconfirmed' | 'confirmed' | 'unsubscribed';
    created_at: string;
}

// ============================================================================
// FORM TYPES (Elementor, WPForms)
// ============================================================================

export interface WPFormsLog {
    id: number;
    form_id: number;
    title: string;
    message: string;
    type: string;
    date: string;
}

export interface WPFormsPayment {
    id: number;
    form_id: number;
    status: string;
    total: string;
    currency: string;
    gateway: string;
    transaction_id?: string;
    date: string;
    customer_email?: string;
}

export interface NewsletterSubscribeRequest {
    email: string;
    name?: string;
    form_id?: number;
}

export interface NewsletterSubscribeResponse {
    success: boolean;
    message: string;
    log_id?: number;
}

export interface WPFormRead {
    id: number;
    title: string;
    date: string;
    type: string;
    content?: string;
}

export interface WPFormCreate {
    title: string;
    content?: string;
}

export interface WPFormEntry {
    id: number;
    form_id: number;
    title: string;
    message: string;
    types: string;
    created_at: string;
}

export interface ElementorSubmission {
    id: number;
    form_name: string;
    post_id: number;
    date: string;
    user_ip: string;
    user_agent: string;
    status: string;
    is_read: boolean;
    data: Record<string, string>; // Field values
}

export interface MarkReadRequest {
    is_read: boolean;
}

// ============================================================================
// MEDIA TYPES
// ============================================================================

export interface MediaCreate {
    source_url: string;
    title?: string;
    caption?: string;
    alt_text?: string;
    description?: string;
}

export interface MediaUpdate {
    title?: string;
    caption?: string;
    alt_text?: string;
    description?: string;
}

export interface ProductImageRequest {
    media_id: number;
    source_url?: string; // Optional if using existing media_id
}

export interface ProductGalleryRequest {
    images: number[]; // Array of media_ids
}

export interface FeaturedImageRequest {
    media_id: number;
}
// ============================================================================
// CRYPTO PAYMENT TYPES
// ============================================================================

export interface CryptoCurrency {
    id: string;
    name: string;
    ticker: string;
    image_url?: string;
    min_amount?: number;
    network?: string;
}

export interface CryptoPaymentRead {
    id: number;
    payment_id: string; // NOWPayments payment_id
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    order_id: string;
    order_description?: string;
    invoice_url?: string;
    created_at: string;
    updated_at: string;
}

export interface CryptoInvoiceRequest {
    price_amount: number;
    price_currency: string;
    order_id: string;
    order_description?: string;
    success_url?: string;
    cancel_url?: string;
}

export interface CryptoPaymentRequest {
    price_amount: number;
    price_currency: string;
    pay_currency: string;
    order_id: string;
}

export interface CryptoEstimate {
    amount_from: number;
    currency_from: string;
    amount_to: number;
    currency_to: string;
}

export interface CryptoStatusResponse {
    status: string;
    message: string;
}
// ============================================================================
// DYNAMIC PAGES API TYPES (Signals, Bots, Indicators, Books, Videos)
// ============================================================================

export interface DynamicSignal {
    id: number;
    title: string;
    date: string;
    status: string;
    instrument: string;
    signal_type: 'vip' | 'free';
    entry: string;
    sl: string;
    tp1: string;
    tp2?: string;
    image_url?: string;
    price?: string;
    type?: string;
}

export type SignalPagination = PaginatedResponse<DynamicSignal>;

export interface DynamicSignalCreate {
    title: string;
    instrument: string;
    signal_type: 'vip' | 'free';
    entry: string;
    sl: string;
    tp1: string;
    tp2?: string;
    status?: string;
    image_url?: string;
    price?: string;
    type?: string;
}

export interface DynamicTradingTool {
    id: number;
    title: string;
    status: string;
    tool_type: 'bot' | 'indicator';
    category: 'vip' | 'free';
    description: string;
    download_url?: string;
    purchase_url?: string;
    price?: string;
    image_url?: string;
    seller_payment_link?: string;
    whop_payment_link?: string;
}

export type TradingToolPagination = PaginatedResponse<DynamicTradingTool>;

export interface DynamicTradingToolCreate {
    title: string;
    tool_type: 'bot' | 'indicator';
    category: 'vip' | 'free';
    description: string;
    download_url?: string;
    purchase_url?: string;
    price?: string;
    status?: string;
    image_url?: string;
    seller_payment_link?: string;
    whop_payment_link?: string;
}

export interface DynamicBook {
    id: number;
    title: string;
    status: string;
    is_free: boolean;
    description: string;
    download_url?: string;
    purchase_url?: string;
    image_url?: string;
    price?: string;
    seller_payment_link?: string;
    whop_payment_link?: string;
}

export type BookPagination = PaginatedResponse<DynamicBook>;

export interface DynamicBookCreate {
    title: string;
    is_free: boolean;
    description: string;
    download_url?: string;
    purchase_url?: string;
    status?: string;
    image_url?: string;
    price?: string;
    seller_payment_link?: string;
    whop_payment_link?: string;
}

export interface DynamicVideo {
    id: string; // youtube_id
    title: string;
    thumbnail: string;
    image_url?: string;
}

export interface DynamicVideoCreate {
    title: string;
    youtube_id: string;
    image_url?: string;
}

// Keep existing for compatibility if needed, but mark as deprecated or update
export type Signal = DynamicSignal;
export type TradingTool = DynamicTradingTool;
export type TradingVideo = DynamicVideo;

// ============================================================================
// ACCOUNT MANAGEMENT TYPES
// ============================================================================

export interface AccountManagementData {
    id: string;
    account_id: string;
    broker: string;
    server: string;
    capital: number;
    manager: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface AccountManagementListResponse {
    success: boolean;
    count: number;
    data: AccountManagementData[];
}

export interface AccountManagementAdminRead extends AccountManagementData {
    user_name: string;
    user_email: string;
    password?: string;
}

export interface AccountManagementAdminListResponse {
    success: boolean;
    count: number;
    data: AccountManagementAdminRead[];
}

export interface AccountManagementResponse {
    success: boolean;
    message: string;
    data: AccountManagementData;
}

// ============================================================================
// COPY TRADING TYPES
// ============================================================================

export interface CopyTradingData {
    id: string;
    account_id: string;
    server: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CopyTradingResponse {
    success: boolean;
    message: string;
    data: CopyTradingData;
}

export interface CopyTradingListResponse {
    success: boolean;
    count: number;
    data: CopyTradingData[];
}

export interface CopyTradingAdminRead extends CopyTradingData {
    user_name: string;
    user_email: string;
    password?: string;
}

export interface CopyTradingAdminListResponse {
    success: boolean;
    count: number;
    data: CopyTradingAdminRead[];
}

export interface CopyTradingConnectRequest {
    accountId: string;
    password: string;
    server: string;
}

export interface CopyTradingUpdateStatusRequest {
    status: string;
}
