/**
 * Mortgage Agent Configuration File
 * 
 * Edit the values below to customize the website for a specific mortgage agent.
 * This acts as the data source for the personal information template.
 */

const agentConfig = {
    // Basic Information
    branding: {
        companyName: "ASK JUTHIS", // Appears in navbar
        accentColor: "#0F1E2E",          // Deep Navy
        secondaryColor: "#4A5D73",       // Slate Blue
        warmColor: "#F4F1EE"             // Warm
    },

    agent: {
        name: "Juthis",
        title: "Expert Mortgage Services",
        licenseNumber: "NMLS #123456",
        photoUrl: "headshot.webp",
        testimonials: [
            {
                quote: "AskJuthis made buying our first home surprisingly easy. They took the time to answer all our frantic questions and got us a rate we didn't think was possible!",
                author: "The Miller Family",
                role: "First-time Homebuyers"
            },
            {
                quote: "I was worried about refinancing my mortgage, but Juthis guided me through every step. The process was transparent and much faster than I expected.",
                author: "Sarah Jenkins",
                role: "Refinance Client"
            },
            {
                quote: "The team at AskJuthis is incredibly professional and knowledgeable. They found us a great rate and made the entire application process stress-free.",
                author: "Michael & Emily",
                role: "Investment Property Owners"
            }
        ],
        fullBio: `Personalized mortgage solutions designed to fit your unique life goals. From first-time buyers to refinancing experts, we navigate the complexity so you don't have to.`
    },

    contact: {
        phone: "(555) 123-4567",
        phoneLink: "5551234567", // For tel: links
        email: "hello@askjuthis.com",
        officeAddress: "Ottawa, ON",
        bookingWidgetUrl: "https://calendly.com/abinan-jeyachandran/30min",
        bookingUrl: "#booking" // Adjusted to match new ID
    },

    social: {
        linkedin: "https://www.linkedin.com/in/juthis-kuper/",
        instagram: "https://www.instagram.com/askjuthis/",
        x: "https://x.com"
    },

    // About / Why Choose Section (Based on new design)
    about: {
        title: "Why Choose Juthis Mortgages?",
        description1: "We are dedicated to helping families achieve their homeownership dreams. Our commitment to personalized service and expert guidance sets us apart from the rest.",
        description2: "We work with a wide network of lenders to ensure you get the most competitive rates and terms. Our transparent process means no hidden fees or surprises—just honest, straightforward mortgage solutions.",
        stats: [
            { icon: "military_tech", value: "50+", label: "Lender Options" },
            { icon: "monetization_on", value: "$500M+", label: "Funded Volume" },
            { icon: "groups", value: "1500+", label: "Families Helped" },
            { icon: "star", value: "5.0", label: "Average Rating" }
        ],
        meetBroker: {
            title: "Meet Your Broker",
            quote: "\"Hi, I'm passionate about helping families find their dream homes. With a deep understanding of the market and a commitment to personalized service, I guide you through every step of the mortgage process.\"",
            description: "Whether you're a first-time buyer or looking to refinance, I'm here to answer your questions and find the best solution for your unique financial situation.",
            linkText: "Read Full Bio →",
            linkUrl: "#bio"
        }
    },

    // Services Offered
    services: [
        {
            id: "purchase",
            title: "Home Purchase",
            description: "Buying your first home or moving up? We find the best rates and terms to make your dream home a reality.",
            details: ["First-time Homebuyer Programs", "Conventional & FHA Loans"],
            icon: "home"
        },
        {
            id: "refinance",
            title: "Refinancing",
            description: "Lower your monthly payments or tap into your home's equity. We analyze your situation to ensure it's the right move.",
            details: ["Rate & Term Refinance", "Cash-Out Equity Access"],
            icon: "attach_money"
        }
    ],

    // The Mortgage Process Roadmap
    processSteps: [
        {
            title: "Discovery & Strategy",
            description: "We start with a deep dive into your financial goals, uncovering the exact mortgage architecture needed to get you approved.",
            icon: "explore"
        },
        {
            title: "The Pre-Approval",
            description: "We secure a firm commitment from our elite lender network, locking in your rate and giving you absolute buying power.",
            icon: "verified"
        },
        {
            title: "The Property Hunt",
            description: "Shop with absolute confidence. We work directly with your Realtor to structure the financing on the exact home you want.",
            icon: "search"
        },
        {
            title: "Closing & Keys",
            description: "We handle all the complex underwriting and legal coordination behind the scenes so you can focus on moving in.",
            icon: "key"
        }
    ],

    // Credentials & Distinctions
    credentials: {
        title: "Distinctions & Credentials",
        subtitle: "A Standard of Excellence",
        items: [
            { icon: "workspace_premium", title: "Top 1% Originator", description: "Consistently ranked in the top 1% of mortgage professionals nationwide for funding volume." },
            { icon: "gavel", title: "Licensed Level 2 Agent", description: "Fully licensed and regulated by the Financial Services Regulatory Authority (FSRA)." },
            { icon: "public", title: "MPC Member", description: "Active member in good standing with Mortgage Professionals Canada." },
            { icon: "school", title: "Structuring Expert", description: "Specialized training in alternative lending, B-lender bridging, and multi-collateral financing." }
        ]
    },

    // Live Market Rates (Top Bar)
    liveRates: {
        lastUpdated: "Today",
        rates: [
            { label: "5-Year Fixed", value: "4.49%" },
            { label: "3-Year Variable", value: "5.80%" },
            { label: "Prime Rate", value: "6.95%" }
        ]
    },

    // Direct Lead Capture Form
    leadCapture: {
        title: "Request Your Custom Rate",
        subtitle: "In 60 Seconds",
        description: "You have strong financing options available. Enter your details to receive your custom rate matrix from our underwriters."
    }
};
