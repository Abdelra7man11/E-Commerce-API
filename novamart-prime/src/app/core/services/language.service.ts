import { Injectable, computed, effect, signal } from '@angular/core';

export type SupportedLanguage = 'en' | 'ar';

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navbar & Header
    'nav.announcement': '⚡ Free Express Delivery on orders over $50 | Use code',
    'nav.prime': 'PRIME',
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.orders': 'Orders',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'nav.signUp': 'Sign Up',
    'nav.logout': 'Log Out',
    'nav.myOrders': 'My Orders',
    'nav.viewFullCart': 'View Full Cart',
    'nav.switchToDark': 'Switch to Dark Mode',
    'nav.switchToLight': 'Switch to Light Mode',
    'nav.languageToggle': 'العربية',
    'nav.langLabel': 'AR',

    // Home Page
    'home.heroBadge': '⚡ FRESH GOURMET SELECTIONS',
    'home.heroTitle': 'Fresh, Premium & Fast Delivery',
    'home.heroSubtitle': 'Explore top gourmet food, artisanal ingredients and essentials delivered fresh to your doorstep within minutes.',
    'home.shopNow': 'Shop Now',
    'home.browseCategories': 'Explore Categories',
    'home.feature1Title': 'Free Express Delivery',
    'home.feature1Desc': 'On all orders exceeding $50',
    'home.feature2Title': '100% Fresh & Authentic',
    'home.feature2Desc': 'Directly from verified producers',
    'home.feature3Title': 'Safe & Secure Payments',
    'home.feature3Desc': 'Visa, Cash, and Mobile Wallets',
    'home.feature4Title': '24/7 Dedicated Support',
    'home.feature4Desc': 'Always here when you need assistance',
    'home.categoriesTitle': 'Shop By Category',
    'home.categoriesSubtitle': 'Discover exceptional food and culinary delights curated for you',
    'home.trendingTitle': 'Trending & Popular Products',
    'home.trendingSubtitle': 'Our customers most beloved gourmet picks this week',
    'home.promoBadge': 'Exclusive Offer',
    'home.promoTitle': 'Get 20% Off Your First Order',
    'home.promoSubtitle': 'Sign up today and unlock instant savings with prime fast delivery across the country.',
    'home.promoCode': 'Use Code: PRIME20',
    'home.newsletterTitle': 'Stay in the Loop',
    'home.newsletterSubtitle': 'Subscribe to our newsletter for secret deals, chef recipes and exclusive seasonal drops.',
    'home.newsletterPlaceholder': 'Enter your email address...',
    'home.subscribeBtn': 'Subscribe',

    // Catalog / Shop
    'shop.breadcrumbHome': 'Home',
    'shop.breadcrumbCatalog': 'Catalog',
    'shop.title': 'Explore Our Products',
    'shop.showing': 'Showing',
    'shop.to': '-',
    'shop.of': 'of',
    'shop.products': 'products',
    'shop.noProducts': 'No products found',
    'shop.sort': 'Sort:',
    'shop.sortNameAsc': 'Alphabetical (A - Z)',
    'shop.sortPriceAsc': 'Price: Low to High',
    'shop.sortPriceDesc': 'Price: High to Low',
    'shop.show': 'Show:',
    'shop.perPage': 'per page',
    'shop.search': 'Search',
    'shop.searchPlaceholder': 'Search items...',
    'shop.categories': 'Categories',
    'shop.allCategories': 'All Categories',
    'shop.brands': 'Brands',
    'shop.allBrands': 'All Brands',
    'shop.resetAll': 'Reset All Filters',
    'shop.active': 'Active:',
    'shop.brandLabel': 'Brand:',
    'shop.categoryLabel': 'Category:',
    'shop.searchLabel': 'Search:',
    'shop.clearAll': 'Clear all',
    'shop.emptyTitle': 'No Products Found',
    'shop.emptyDesc': "We couldn't find any items matching your selected criteria. Try adjusting your filters or search terms.",
    'shop.prev': 'Prev',
    'shop.next': 'Next',
    'shop.connectionErrorTitle': 'Server & Database Connection Error',
    'shop.connectionErrorDesc': 'Unable to connect to the backend server (https://localhost:7112). Please verify the server is running.',
    'shop.retry': 'Retry',

    // Product Card & Details
    'product.addToCart': 'Add to Cart',
    'product.adding': 'Adding...',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.price': 'Price',
    'product.brand': 'Brand',
    'product.category': 'Category',
    'product.description': 'Description',
    'product.quantity': 'Quantity',
    'product.share': 'Share',
    'product.backToCatalog': 'Back to Catalog',
    'product.freeDelivery': 'Free Express Delivery',
    'product.freeDeliveryDesc': 'Guaranteed fresh on arrival',
    'product.securePayment': '100% Safe Payments',
    'product.securePaymentDesc': 'Encrypted checkout process',

    // Cart Drawer & Page
    'cart.title': 'Shopping Cart',
    'cart.items': 'items',
    'cart.emptyTitle': 'Your cart is empty',
    'cart.emptyDesc': "Looks like you haven't added anything to your cart yet.",
    'cart.startShopping': 'Start Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.freeShipping': 'Free',
    'cart.calculatedAtCheckout': 'Calculated at checkout',
    'cart.estimatedTotal': 'Estimated Total',
    'cart.checkoutBtn': 'Proceed to Checkout',
    'cart.clearCart': 'Clear Cart',
    'cart.continueShopping': 'Continue Shopping',
    'cart.remove': 'Remove',

    // Checkout
    'checkout.title': 'Complete Your Order',
    'checkout.stepAddress': 'Address',
    'checkout.stepDelivery': 'Delivery',
    'checkout.stepPayment': 'Payment',
    'checkout.stepReview': 'Review',
    'checkout.addressTitle': 'Shipping & Delivery Address',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.street': 'Street Address',
    'checkout.city': 'City',
    'checkout.state': 'State / Governorate',
    'checkout.zipCode': 'Postal / Zip Code',
    'checkout.saveAddress': 'Save as default delivery address',
    'checkout.deliveryTitle': 'Choose Delivery Method',
    'checkout.paymentTitle': 'Select Payment Method',
    'checkout.cardTitle': 'Credit / Debit Card (Visa, MasterCard)',
    'checkout.cardDesc': 'Instant, secure and encrypted online credit card payment.',
    'checkout.cashTitle': 'Cash on Delivery (COD)',
    'checkout.cashDesc': 'Pay easily in cash upon receiving and inspecting your items.',
    'checkout.walletsTitle': 'Electronic Wallets & InstaPay',
    'checkout.walletsDesc': 'Vodafone Cash, Orange Money, Etisalat Cash, and InstaPay.',
    'checkout.selectedPayment': 'Selected Payment Method:',
    'checkout.orderSummary': 'Order Summary',
    'checkout.shippingCost': 'Shipping Cost',
    'checkout.total': 'Total',
    'checkout.backBtn': 'Back',
    'checkout.nextBtn': 'Continue',
    'checkout.payAndPlace': 'Place Order & Pay',
    'checkout.processing': 'Processing Order...',

    // Success & Invoice
    'success.title': 'Order Placed Successfully!',
    'success.subtitle': 'Thank you for shopping with NovaMart Prime. Your order has been registered and is being prepared.',
    'success.orderId': 'Order ID:',
    'success.paymentMethod': 'Payment Method:',
    'success.deliveryAddress': 'Delivery Address:',
    'success.orderStatus': 'Order Status:',
    'success.confirmed': 'Confirmed',
    'success.printInvoice': 'Print Official Invoice',
    'success.backToShop': 'Back to Catalog',
    'invoice.title': 'OFFICIAL TAX INVOICE',
    'invoice.date': 'Date',
    'invoice.customer': 'Customer',
    'invoice.payment': 'Payment Method',
    'invoice.address': 'Delivery Address',
    'invoice.product': 'Product Description',
    'invoice.qty': 'Qty',
    'invoice.price': 'Unit Price',
    'invoice.total': 'Total',
    'invoice.subtotal': 'Subtotal',
    'invoice.shipping': 'Shipping',
    'invoice.grandTotal': 'Grand Total',
    'invoice.thankYou': 'Thank you for your purchase with NovaMart Prime!',

    // Orders
    'orders.title': 'My Orders',
    'orders.subtitle': 'Track and review your previous purchases',
    'orders.emptyTitle': 'No orders yet',
    'orders.emptyDesc': 'You have not placed any orders yet. Explore our catalog to find your favorite items!',
    'orders.orderNum': 'Order #',
    'orders.viewDetails': 'View Details',

    // Auth
    'auth.welcomeBack': 'Welcome Back',
    'auth.loginSubtitle': 'Sign in to access your saved basket, orders, and personalized Prime perks.',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.displayName': 'Full Name',
    'auth.loginBtn': 'Sign In',
    'auth.noAccount': "Don't have an account?",
    'auth.signUpHere': 'Sign Up',
    'auth.createAccount': 'Create an Account',
    'auth.registerSubtitle': 'Join NovaMart Prime for free fast delivery and exclusive deals.',
    'auth.registerBtn': 'Create Account',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.loginHere': 'Sign In',

    // Footer
    'footer.about': 'NovaMart Prime is your modern luxury online shopping destination, providing curated gourmet foods, rapid delivery, and supreme customer satisfaction.',
    'footer.quickLinks': 'Quick Links',
    'footer.categories': 'Categories',
    'footer.support': 'Customer Support',
    'footer.faq': 'Help & FAQs',
    'footer.shippingPolicy': 'Shipping Policy',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': '© 2026 NovaMart Prime. All rights reserved. Designed with excellence.'
  },
  ar: {
    // Navbar & Header
    'nav.announcement': '⚡ توصيل مجاني سريع للطلبات أكثر من 50$ | استخدم كود',
    'nav.prime': 'برايم',
    'nav.home': 'الرئيسية',
    'nav.catalog': 'الكتالوج والمنتجات',
    'nav.orders': 'طلباتي',
    'nav.cart': 'السلة',
    'nav.login': 'تسجيل الدخول',
    'nav.signUp': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    'nav.myOrders': 'سجل طلباتي',
    'nav.viewFullCart': 'عرض السلة كاملة',
    'nav.switchToDark': 'التحويل للوضع الليلي',
    'nav.switchToLight': 'التحويل للوضع النهاري',
    'nav.languageToggle': 'English',
    'nav.langLabel': 'EN',

    // Home Page
    'home.heroBadge': '⚡ مختارات فاخرة وطازجة دائماً',
    'home.heroTitle': 'طازج، فاخر وتوصيل فائق السرعة',
    'home.heroSubtitle': 'اكتشف أرقى المنتجات الغذائية والمكونات الفاخرة تصلك طازجة مباشرة حتى باب منزلك في دقائق معدودة.',
    'home.shopNow': 'تسوق الآن',
    'home.browseCategories': 'تصفح الأقسام',
    'home.feature1Title': 'توصيل مجاني فائق السرعة',
    'home.feature1Desc': 'على جميع الطلبات التي تتجاوز 50$',
    'home.feature2Title': 'طازج وأصلي 100%',
    'home.feature2Desc': 'مباشرة من أفضل الموردين المعتمدين',
    'home.feature3Title': 'دفع آمن ومحمي بالكامل',
    'home.feature3Desc': 'فيزا، كاش، وإنستاباي ومحافظ إلكترونية',
    'home.feature4Title': 'دعم فني مخصص 24/7',
    'home.feature4Desc': 'فريقنا في خدمتك دائماً على مدار الساعة',
    'home.categoriesTitle': 'تسوق حسب الفئات والأقسام',
    'home.categoriesSubtitle': 'اكتشف أشهى المأكولات والمستلزمات المختارة بعناية فائقة من أجلك',
    'home.trendingTitle': 'المنتجات الأكثر طلباً وشهرة',
    'home.trendingSubtitle': 'أفضل مختارات زبائننا المفضلة هذا الأسبوع بأعلى جودة',
    'home.promoBadge': 'عرض استثنائي حصري',
    'home.promoTitle': 'احصل على خصم 20% على طلبك الأول',
    'home.promoSubtitle': 'سجل حسابك اليوم واستمتع بتوفير فوري وشحن برايم فائق السرعة في جميع أنحاء الجمهورية.',
    'home.promoCode': 'كود الخصم: PRIME20',
    'home.newsletterTitle': 'ابقَ على اطلاع بأحدث العروض',
    'home.newsletterSubtitle': 'اشترك في نشرتنا البريدية لتصلك العروض السرية وخصومات الموسم الحصرية قبل الجميع.',
    'home.newsletterPlaceholder': 'أدخل بريدك الإلكتروني...',
    'home.subscribeBtn': 'اشتراك الآن',

    // Catalog / Shop
    'shop.breadcrumbHome': 'الرئيسية',
    'shop.breadcrumbCatalog': 'الكتالوج',
    'shop.title': 'استكشف تشكيلة منتجاتنا',
    'shop.showing': 'عرض',
    'shop.to': 'إلى',
    'shop.of': 'من إجمالي',
    'shop.products': 'منتج',
    'shop.noProducts': 'لم يتم العثور على أي منتج',
    'shop.sort': 'الترتيب:',
    'shop.sortNameAsc': 'أبجدياً (أ - ي)',
    'shop.sortPriceAsc': 'السعر: من الأقل للأعلى',
    'shop.sortPriceDesc': 'السعر: من الأعلى للأقل',
    'shop.show': 'العرض:',
    'shop.perPage': 'لكل صفحة',
    'shop.search': 'بحث',
    'shop.searchPlaceholder': 'ابحث عن المنتجات بالاسم...',
    'shop.categories': 'الفئات والأقسام',
    'shop.allCategories': 'جميع الفئات',
    'shop.brands': 'العلامات التجارية',
    'shop.allBrands': 'جميع العلامات',
    'shop.resetAll': 'إعادة ضبط كل الفلاتر',
    'shop.active': 'الفلاتر النشطة:',
    'shop.brandLabel': 'الماركة:',
    'shop.categoryLabel': 'القسم:',
    'shop.searchLabel': 'البحث:',
    'shop.clearAll': 'مسح الكل',
    'shop.emptyTitle': 'لم يتم العثور على منتجات',
    'shop.emptyDesc': 'لم نجد أي منتجات تطابق معايير الفلترة أو البحث المحددة. جرب تغيير الفلاتر أو البحث بكلمات أخرى.',
    'shop.prev': 'السابق',
    'shop.next': 'التالي',
    'shop.connectionErrorTitle': 'خطأ في الاتصال بالخادم وقاعدة البيانات',
    'shop.connectionErrorDesc': 'تعذر الاتصال بخادم الـ Backend (https://localhost:7112). يرجى التأكد من تشغيل السيرفر.',
    'shop.retry': 'إعادة المحاولة',

    // Product Card & Details
    'product.addToCart': 'أضف للسلة',
    'product.adding': 'جارِ الإضافة...',
    'product.inStock': 'متوفر بالمخزون',
    'product.outOfStock': 'نفد من المخزون',
    'product.price': 'السعر',
    'product.brand': 'الماركة',
    'product.category': 'القسم',
    'product.description': 'الوصف التفصيلي',
    'product.quantity': 'الكمية',
    'product.share': 'مشاركة',
    'product.backToCatalog': 'العودة للكتالوج',
    'product.freeDelivery': 'توصيل فائق السرعة',
    'product.freeDeliveryDesc': 'ضمان وصول المنتج طازجاً',
    'product.securePayment': 'دفع آمن ومحمي 100%',
    'product.securePaymentDesc': 'عملية دفع مشفرة بالكامل',

    // Cart Drawer & Page
    'cart.title': 'سلة المشتريات',
    'cart.items': 'منتجات',
    'cart.emptyTitle': 'سلة المشتريات فارغة',
    'cart.emptyDesc': 'يبدو أنك لم تضف أي منتجات إلى سلتك حتى الآن.',
    'cart.startShopping': 'ابدأ التسوق الآن',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.shipping': 'تكلفة التوصيل',
    'cart.freeShipping': 'مجاني',
    'cart.calculatedAtCheckout': 'تُحسب عند إتمام الطلب',
    'cart.estimatedTotal': 'الإجمالي المقدر',
    'cart.checkoutBtn': 'المتابعة لإتمام الطلب',
    'cart.clearCart': 'إفراغ السلة',
    'cart.continueShopping': 'مواصلة التسوق',
    'cart.remove': 'حذف',

    // Checkout
    'checkout.title': 'إتمام عملية الشراء والدفع',
    'checkout.stepAddress': 'العنوان',
    'checkout.stepDelivery': 'التوصيل',
    'checkout.stepPayment': 'الدفع',
    'checkout.stepReview': 'المراجعة',
    'checkout.addressTitle': 'عنوان الشحن والتسليم',
    'checkout.firstName': 'الاسم الأول',
    'checkout.lastName': 'اسم العائلة',
    'checkout.street': 'عنوان الشارع بالتفصيل',
    'checkout.city': 'المدينة',
    'checkout.state': 'المحافظة / المنطقة',
    'checkout.zipCode': 'الرمز البريدي',
    'checkout.saveAddress': 'حفظ كعنوان توصيل افتراضي',
    'checkout.deliveryTitle': 'اختر طريقة التوصيل المناسبة',
    'checkout.paymentTitle': 'اختر طريقة الدفع المناسبة',
    'checkout.cardTitle': 'بطاقة بنكية / فيزا وماستركارد',
    'checkout.cardDesc': 'دفع إلكتروني فوري ومؤمن ومشفر بالكامل.',
    'checkout.cashTitle': 'الدفع نقداً عند الاستلام (كاش)',
    'checkout.cashDesc': 'ادفع نقداً بكل راحة وأمان فور استلام طلبك ومعاينته.',
    'checkout.walletsTitle': 'محافظ إلكترونية وإنستاباي (InstaPay)',
    'checkout.walletsDesc': 'فودافون كاش، أورنج موني، اتصالات كاش، وتطبيق إنستاباي.',
    'checkout.selectedPayment': 'طريقة الدفع المختارة:',
    'checkout.orderSummary': 'ملخص الطلب',
    'checkout.shippingCost': 'رسوم الشحن',
    'checkout.total': 'الإجمالي النهائي',
    'checkout.backBtn': 'السابق',
    'checkout.nextBtn': 'المتابعة',
    'checkout.payAndPlace': 'تأكيد الطلب والدفع',
    'checkout.processing': 'جارِ تسجيل ومعالجة طلبك...',

    // Success & Invoice
    'success.title': 'تم تأكيد طلبك بنجاح!',
    'success.subtitle': 'شكراً لتسوقك من نوفا مارت برايم. تم تسجيل طلبك وهو الآن قيد التجهيز السريع للشحن.',
    'success.orderId': 'رقم الطلب:',
    'success.paymentMethod': 'طريقة الدفع:',
    'success.deliveryAddress': 'عنوان التوصيل:',
    'success.orderStatus': 'حالة الطلب:',
    'success.confirmed': 'مؤكد',
    'success.printInvoice': 'طباعة الفاتورة الرسمية',
    'success.backToShop': 'العودة للتسوق',
    'invoice.title': 'فاتورة ضريبية رسمية',
    'invoice.date': 'التاريخ',
    'invoice.customer': 'العميل',
    'invoice.payment': 'طريقة الدفع',
    'invoice.address': 'عنوان التوصيل',
    'invoice.product': 'بيان المنتج',
    'invoice.qty': 'الكمية',
    'invoice.price': 'سعر الوحدة',
    'invoice.total': 'الإجمالي',
    'invoice.subtotal': 'المجموع الفرعي',
    'invoice.shipping': 'الشحن',
    'invoice.grandTotal': 'المجموع الكلي',
    'invoice.thankYou': 'شكراً لاختياركم نوفا مارت برايم! نسعد دائماً بخدمتكم.',

    // Orders
    'orders.title': 'سجل طلباتي',
    'orders.subtitle': 'تتبع وراجع طلباتك ومشترياتك السابقة بكل سهولة',
    'orders.emptyTitle': 'لا توجد طلبات سابقة',
    'orders.emptyDesc': 'لم تقم بتسجيل أي طلبات حتى الآن. استكشف كتالوج المنتجات وابدأ طلبك الأول!',
    'orders.orderNum': 'طلب رقم #',
    'orders.viewDetails': 'عرض التفاصيل',

    // Auth
    'auth.welcomeBack': 'أهلاً بك مجدداً',
    'auth.loginSubtitle': 'سجل دخولك للوصول إلى سلتك المحفوظة وطلباتك ومزايا برايم الحصرية.',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.displayName': 'الاسم الكامل',
    'auth.loginBtn': 'تسجيل الدخول',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.signUpHere': 'إنشاء حساب جديد',
    'auth.createAccount': 'إنشاء حساب جديد',
    'auth.registerSubtitle': 'انضم إلى نوفا مارت برايم واستمتع بشحن مجاني سريع وأقوى العروض.',
    'auth.registerBtn': 'إنشاء الحساب',
    'auth.alreadyAccount': 'لديك حساب بالفعل؟',
    'auth.loginHere': 'تسجيل الدخول',

    // Footer
    'footer.about': 'نوفا مارت برايم وجهتك العصرية الرائدة للتسوق الفاخر، نقدم أشهى المنتجات الطازجة مع توصيل فائق السرعة وضمان الرضا الكامل لعملائنا.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.categories': 'الفئات والأقسام',
    'footer.support': 'خدمة العملاء',
    'footer.faq': 'الأسئلة الشائعة والمساعدة',
    'footer.shippingPolicy': 'سياسة الشحن والتوصيل',
    'footer.terms': 'الشروط والأحكام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.copyright': '© 2026 نوفا مارت برايم. جميع الحقوق محفوظة. صُمم بأعلى معايير الإتقان.'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<SupportedLanguage>('en');
  isArabic = computed(() => this.currentLang() === 'ar');

  constructor() {
    // Check saved language or browser default
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('novamart_lang') as SupportedLanguage;
      if (saved === 'ar' || saved === 'en') {
        this.currentLang.set(saved);
      } else {
        const browserLang = navigator.language?.toLowerCase() || '';
        this.currentLang.set(browserLang.startsWith('ar') ? 'ar' : 'en');
      }
    }

    this.applyLanguage(this.currentLang());

    // Reactively update DOM and local storage
    effect(() => {
      this.applyLanguage(this.currentLang());
    });
  }

  toggleLanguage(): void {
    const nextLang: SupportedLanguage = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
  }

  setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('novamart_lang', lang);
    }
    this.applyLanguage(lang);
  }

  t(key: string, fallback?: string): string {
    const lang = this.currentLang();
    const dictionary = TRANSLATIONS[lang];
    if (dictionary && dictionary[key]) {
      return dictionary[key];
    }
    // Fallback to English if not found
    const enDictionary = TRANSLATIONS['en'];
    if (enDictionary && enDictionary[key]) {
      return enDictionary[key];
    }
    return fallback || key;
  }

  private applyLanguage(lang: SupportedLanguage): void {
    if (typeof document === 'undefined') return;
    const isAr = lang === 'ar';
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('lang', lang);
    root.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    if (isAr) {
      body.classList.add('rtl-mode');
    } else {
      body.classList.remove('rtl-mode');
    }
  }
}
