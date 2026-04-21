'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import { clearCmsCache } from '@/lib/useCms';
import EventForm from '@/components/admin/EventForm';
import { Loader2, Save, Upload, Plus, Trash2, ChevronDown, ChevronUp, Pencil, Globe, EyeOff, Eye, CalendarDays, X, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

// ── CmsEvent type (for inline event manager) ─────────────────────────────
interface CmsEvent {
  _id: string;
  title: { en: string; fr: string };
  description?: { en: string; fr: string };
  venue?: { en: string; fr: string };
  address?: { en: string; fr: string };
  category: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  badge?: string;
  isPublic: boolean;
  coverImage?: string;
  ticketTypes?: Array<{ name: { en: string; fr: string }; price: number; currency: string; totalSeats: number; description: { en: string; fr: string } }>;
}

// ── Default content (mirrors frontend fallbacks) ─────────────────────────
const SECTION_DEFAULTS: Record<string, Record<string, Partial<CmsSection>>> = {
  home: {
    hero: {
      image: '/Coveer Web-01-01.png', // HeroCarousel.tsx uses only this field
    },
    events: {
      title: { en: 'Upcoming Events', fr: 'Événements à venir' },
      subtitle: { en: 'Don\'t miss out on the best events', fr: 'Ne manquez pas les meilleurs événements' },
    },
    partners: {
      title: { en: 'Our Partners', fr: 'Nos partenaires' },
      images: [],
    },
    bestOfSeason: {
      title: { en: 'Best of the Season', fr: 'Le meilleur de la saison' },
      images: [],
    },
    topSeller: {
      extra: {
        slides: JSON.stringify([
          { image: '/TOP%20SLLER/22054_9834dd51a16eba240c0c6c97a5237e74-0-en1771488562.jpg', title: 'Bel Suono: Three Pianos World Hits Gala', date: 'FEB 21 NOV', price: '500' },
          { image: '/TOP%20SLLER/22078_75ef9ba7a61c8303513ef023de00195d-0-en1771489174.jpg', title: 'Big 5 Concert: Stars of Arabic Music Live', date: 'MAR 15 DEC', price: '350' },
          { image: '/TOP%20SLLER/22099_3899b925d49dbee2814e0c1278a6dc64-0-en1771579388.jpg', title: 'Sessions: The Ultimate Live Music Experience', date: 'APR 20 JAN', price: '450' },
        ]),
        bottomImages: JSON.stringify([
          '/TOP%20SLLER/22054_9834dd51a16eba240c0c6c97a5237e74-0-en1771488562.jpg',
          '/TOP%20SLLER/22078_75ef9ba7a61c8303513ef023de00195d-0-en1771489174.jpg',
          '/TOP%20SLLER/22099_3899b925d49dbee2814e0c1278a6dc64-0-en1771579388.jpg',
        ]),
      },
    },
    platinumlist: {
      title: { en: 'Why buy with Oshaia?', fr: 'Pourquoi acheter avec Oshaia ?' },
      subtitle: { en: 'Mauritius Event Tickets', fr: 'Billets d\'événements à Maurice' },
      image: '/Red Simple Typographic 2026 Christmas Supplies Logo.png',
      extra: {
        desc1en: 'Mauritius is a vibrant island with a rich calendar of concerts, festivals, cultural shows, and live entertainment throughout the year. With so many events happening across the island, finding the right experience that fits your interests, schedule, and budget can sometimes be challenging.',
        desc1fr: 'Maurice est une île vibrante avec un riche calendrier de concerts, festivals, spectacles culturels et divertissements tout au long de l\'année.',
        desc2en: 'Oshaia.com simplifies this process by offering a modern and reliable platform to discover and book the best events in Mauritius. Our platform continuously tracks upcoming events, helping users explore and secure their tickets in just a few simple steps.',
        desc2fr: 'Oshaia.com simplifie ce processus en offrant une plateforme moderne et fiable pour découvrir et réserver les meilleurs événements à Maurice.',
        desc3en: 'Designed with advanced technology, Oshaia.com provides a seamless, user-friendly, and easy-to-use experience. The platform is supported by highly secure encrypted payment systems, ensuring every transaction is safe, reliable, and protected.',
        desc3fr: 'Conçu avec une technologie avancée, Oshaia.com offre une expérience fluide et facile à utiliser, soutenue par des systèmes de paiement cryptés hautement sécurisés.',
        desc4en: 'Our mission is to connect people with the most exciting events across Mauritius while offering a convenient, secure, and eco-friendly digital ticketing solution. With Oshaia.com, discovering and booking event experiences becomes simple, efficient, and enjoyable.',
        desc4fr: 'Notre mission est de connecter les gens avec les événements les plus passionnants à Maurice tout en offrant une solution de billetterie numérique pratique, sécurisée et écologique.',
      },
    },
  },
  about: {
    hero: {
      title: { en: 'About Us', fr: 'À propos de nous' },
      subtitle: { en: 'Your trusted platform for discovering and booking amazing events.', fr: 'Votre plateforme de confiance pour découvrir et réserver des événements incroyables.' },
      image: '/About%20Us.jpeg',
    },
    whoWeAre: {
      title: { en: 'Who We Are', fr: 'Qui sommes-nous' },
      description: {
        en: 'Oshaia.com is a modern event ticketing platform created to make discovering and booking events simple, fast, and reliable. Our goal is to provide a seamless experience for both event organisers and attendees through a secure and user-friendly digital platform.',
        fr: 'Nous sommes une plateforme de billetterie événementielle dynamique conçue pour rendre votre expérience événementielle fluide — de la navigation à la réservation. Notre mission est de connecter les organisateurs d\'événements et les participants grâce à un environnement numérique intuitif et sécurisé.',
      },
      image: '/about us small square.jpeg',
      extra: {
        desc2En: 'We connect people with the best events happening across Mauritius while giving organisers powerful tools to manage ticket sales, promotions, and event access efficiently.',
        desc2Fr: 'Que vous souhaitiez organiser des concerts, des festivals, des conférences ou des rassemblements communautaires, nous fournissons les outils pour gérer efficacement les ventes de billets, les sélections de sièges et les promotions.',
      },
    },
    services: {
      title: { en: 'What We Offer', fr: 'Ce que nous offrons' },
      extra: {
        card1titleEn: 'Online Ticketing',
        card1titleFr: 'Billetterie en ligne',
        card1descEn: 'Book your tickets for concerts, sports, and festivals instantly through our secure platform.',
        card1descFr: 'Réservez vos billets pour concerts, sports et festivals instantanément via notre plateforme sécurisée.',
        card2titleEn: 'Event Management',
        card2titleFr: 'Gestion d\'événements',
        card2descEn: 'Event organizers can easily manage schedules, ticket categories, and customer data.',
        card2descFr: 'Les organisateurs peuvent facilement gérer les horaires, catégories de billets et données clients.',
        card3titleEn: 'Sponsor & Partner Access',
        card3titleFr: 'Accès sponsors et partenaires',
        card3descEn: 'We connect sponsors with events that match their audience and brand goals.',
        card3descFr: 'Nous connectons les sponsors avec des événements correspondant à leur audience et objectifs de marque.',
      },
    },
    sponsors: {
      title: { en: 'Our Sponsors', fr: 'Nos sponsors' },
      images: [],
    },
    whyChooseUs: {
      title: { en: 'Why Choose Us', fr: 'Pourquoi nous choisir' },
      extra: {
        card1titleEn: 'Secure Payment',
        card1titleFr: 'Paiement sécurisé',
        card1descEn: 'All transactions are encrypted for your safety and peace of mind.',
        card1descFr: 'Toutes les transactions sont cryptées pour votre sécurité et votre tranquillité d\'esprit.',
        card2titleEn: 'Fast & Easy',
        card2titleFr: 'Rapide et facile',
        card2descEn: 'Book tickets in just a few clicks with our user-friendly interface.',
        card2descFr: 'Réservez des billets en quelques clics grâce à notre interface conviviale.',
        card3titleEn: 'Customer Support',
        card3titleFr: 'Support client',
        card3descEn: 'We\'re here to help — from booking issues to event inquiries.',
        card3descFr: 'Nous sommes là pour vous aider — des problèmes de réservation aux questions sur les événements.',
      },
    },
    cta: {
      title: { en: 'Join Thousands of Event-Goers Today', fr: 'Rejoignez des milliers d\'amateurs d\'événements aujourd\'hui' },
      description: {
        en: 'Experience the easiest way to discover and attend your favorite events.',
        fr: 'Découvrez la façon la plus simple de trouver et participer à vos événements préférés.',
      },
      buttonText: { en: 'Browse Events', fr: 'Parcourir les événements' },
      buttonLink: '/event',
    },
  },
  footer: {
    main: {
      title: { en: 'KEEP IN TOUCH', fr: 'RESTEZ EN CONTACT' },
      description: {
        en: 'Beyond your journey — your trusted platform for events & ticketing.',
        fr: 'Au-delà de votre voyage — votre plateforme de confiance pour les événements et la billetterie.',
      },
    },
    social: {
      extra: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        youtube: 'https://youtube.com',
      },
    },
    contact: {
      extra: {
        email: 'contact@oshaia.com',
        phone: '+230 5000 0000',
        address: 'Port Louis, Mauritius',
      },
    },
    navigation: {
      extra: {
        col1HeaderEn: 'About Us', col1HeaderFr: 'À propos de nous',
        col2HeaderEn: 'Categories', col2HeaderFr: 'Catégories',
        col3HeaderEn: 'Services', col3HeaderFr: 'Services',
        col4HeaderEn: 'Customer', col4HeaderFr: 'Client',
        col1Links: '[{"label":"Who We Are?","href":"/about"},{"label":"Home","href":"/"},{"label":"Events","href":"/event"},{"label":"Help Center","href":"/help"},{"label":"Terms & Conditions","href":"/terms"}]',
        col2Links: '[{"label":"All","href":"/event"},{"label":"Concerts","href":"/event"},{"label":"Festivals","href":"/event"},{"label":"Conferences","href":"/event"},{"label":"Shows","href":"/event"},{"label":"Sports","href":"/event"}]',
        col3Links: '[{"label":"Event services","href":"/about"},{"label":"Marketing services","href":"/about"},{"label":"Venue ticketing","href":"/about"},{"label":"Organisers\' Guide","href":"/help"}]',
        col4Links: '[{"label":"My Profile","href":"/profile"},{"label":"My Bookings","href":"/account"},{"label":"How to Buy Tickets","href":"/help"},{"label":"Terms & Conditions","href":"/terms"},{"label":"Help & Support","href":"/help"}]',
        copyright: '\u00a9 2026 Oshaia.com, Aventure Agency LTD. All rights reserved.',
        copyrightFr: '\u00a9 2026 Oshaia.com, Aventure Agency LTD. Tous droits r\u00e9serv\u00e9s.',
      },
    },
  },
  help: {
    hero: {
      title: { en: 'Help Center', fr: 'Centre d\'aide' },
      subtitle: { en: 'Get instant answers to your questions', fr: 'Obtenez des réponses instantanées à vos questions' },
      image: '/Help Center.jpeg',
    },
    faq: {
      title: { en: 'Frequently Asked Questions', fr: 'Questions fréquemment posées' },
      description: {
        en: 'Choose a question below or type your query in the chat.',
        fr: 'Choisissez une question ci-dessous ou tapez votre requête dans le chat.',
      },
    },
    contact: {
      title: { en: 'Still need help?', fr: 'Besoin d\'aide supplémentaire ?' },
      description: {
        en: 'Our support team is ready to assist you with any issue.',
        fr: 'Notre équipe d\'assistance est prête à vous aider pour tout problème.',
      },
      buttonText: { en: 'Contact Support', fr: 'Contacter le support' },
      buttonLink: '/contact',
      extra: {
        legalTitleEn: 'Legal',
        legalTitleFr: 'Légal',
        legalDescEn: 'Please review our terms and cookie policy before using the Oshaia platform and purchasing event tickets.',
        legalDescFr: 'Veuillez consulter nos conditions générales et notre politique de cookies avant d\'utiliser la plateforme Oshaia.',
        termsLabelEn: 'Terms & Conditions',
        termsLabelFr: 'Conditions générales',
        termsLink: '/terms',
        cookieLabelEn: 'Cookie Terms',
        cookieLabelFr: 'Politique des cookies',
        cookieLink: '/terms#cookie-terms',
      },
    },
  },
  terms: {
    hero: {
      title: { en: 'Terms & Conditions', fr: 'Conditions générales' },
      subtitle: { en: 'Please read these terms carefully before purchasing tickets on Oshaia.', fr: 'Veuillez lire attentivement ces conditions avant d\'acheter des billets sur Oshaia.' },
      image: '/About%20Us.jpeg',
    },
    intro: {
      title: { en: 'Oshaia – Event Ticket Purchases', fr: 'Oshaia – Achats de billets d\'événements' },
      description: {
        en: 'These terms and conditions govern all ticket purchases made through the Oshaia platform operated by Aventure Agency LTD. By completing a purchase, you agree to abide by these terms in full.',
        fr: 'Ces conditions générales régissent tous les achats de billets effectués via la plateforme Oshaia exploitée par Aventure Agency LTD. En effectuant un achat, vous acceptez de respecter intégralement ces conditions.',
      },
    },
    footer: {
      extra: {
        note1En: '© 2026 Oshaia.com, Aventure Agency LTD. All rights reserved.',
        note1Fr: '© 2026 Oshaia.com, Aventure Agency LTD. Tous droits réservés.',
        note2En: 'These terms were last updated in March 2026 and supersede all previous versions.',
        note2Fr: 'Ces conditions ont été mises à jour en mars 2026 et remplacent toutes les versions précédentes.',
      },
    },
    section1: { extra: { titleEn: '1. Introduction', titleFr: '1. Introduction', contentEn: 'Welcome to Oshaia. These Terms and Conditions govern your use of the Oshaia platform and the purchase of event tickets through our website and related services. By accessing or using our platform, you agree to be bound by these Terms and Conditions in their entirety.', contentFr: 'Bienvenue sur Oshaia. Ces Conditions générales régissent votre utilisation de la plateforme Oshaia et l\'achat de billets d\'événements. En accédant à notre plateforme, vous acceptez d\'être lié par ces conditions dans leur intégralité.' } },
    section2: { extra: { titleEn: '2. Ticket Purchases', titleFr: '2. Achats de billets', contentEn: 'All ticket purchases made through Oshaia are subject to availability. Your order is confirmed only upon receipt of our confirmation email and successful payment processing.', contentFr: 'Tous les achats de billets effectués via Oshaia sont soumis à disponibilité. Votre commande n\'est confirmée qu\'à réception de notre e-mail de confirmation et du traitement réussi du paiement.' } },
    section3: { extra: { titleEn: '3. Payment & Pricing', titleFr: '3. Paiement et tarification', contentEn: 'All prices displayed on the Oshaia platform are in the currency specified at checkout. Ticket prices may include applicable taxes, service fees, and booking charges.', contentFr: 'Tous les prix affichés sur la plateforme Oshaia sont dans la devise indiquée lors du paiement. Les prix des billets peuvent inclure les taxes applicables, les frais de service et les frais de réservation.' } },
    section4: { extra: { titleEn: '4. Refund & Cancellation Policy', titleFr: '4. Politique de remboursement et d\'annulation', contentEn: 'All ticket sales are generally final. Refunds are only available if the event is officially cancelled or postponed and you are unable to attend on the new date.', contentFr: 'Toutes les ventes de billets sont généralement définitives. Les remboursements ne sont disponibles que si l\'événement est officiellement annulé ou reporté et que vous ne pouvez pas assister à la nouvelle date.' } },
    section5: { extra: { titleEn: '5. Event Changes & Cancellations', titleFr: '5. Modifications et annulations d\'événements', contentEn: 'Events are subject to change or cancellation by the event organiser. Oshaia will make every reasonable effort to notify ticket holders of significant changes via the email address provided.', contentFr: 'Les événements sont susceptibles d\'être modifiés ou annulés par l\'organisateur. Oshaia fera tout son possible pour informer les détenteurs de billets des changements importants.' } },
    section6: { extra: { titleEn: '6. Attendee Conduct & Prohibited Activities', titleFr: '6. Conduite des participants et activités interdites', contentEn: 'By purchasing tickets through Oshaia, you agree to comply with the terms of entry and codes of conduct set by the event organiser and venue. Reselling tickets without authorisation is strictly prohibited.', contentFr: 'En achetant des billets via Oshaia, vous acceptez de respecter les conditions d\'entrée et les codes de conduite établis par l\'organisateur. La revente de billets sans autorisation est strictement interdite.' } },
    section7: { extra: { titleEn: '7. User Accounts & Security', titleFr: '7. Comptes utilisateurs et sécurité', contentEn: 'You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must provide accurate and complete information when registering.', contentFr: 'Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte. Vous devez fournir des informations exactes et complètes lors de l\'inscription.' } },
    section8: { extra: { titleEn: '8. Intellectual Property', titleFr: '8. Propriété intellectuelle', contentEn: 'All content on the Oshaia platform is the property of Aventure Agency LTD or its content licensors and is protected by applicable intellectual property laws.', contentFr: 'Tout le contenu de la plateforme Oshaia est la propriété d\'Aventure Agency LTD ou de ses concédants et est protégé par les lois applicables en matière de propriété intellectuelle.' } },
    section9: { extra: { titleEn: '9. Limitation of Liability', titleFr: '9. Limitation de responsabilité', contentEn: 'To the fullest extent permitted by applicable law, Oshaia and Aventure Agency LTD shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform.', contentFr: 'Dans toute la mesure permise par la loi applicable, Oshaia et Aventure Agency LTD ne seront pas responsables des dommages indirects, accessoires ou consécutifs résultant de votre utilisation de la plateforme.' } },
    section10: { extra: { titleEn: '10. Privacy & Data Protection', titleFr: '10. Confidentialité et protection des données', contentEn: 'Your privacy is important to us. We collect personal information solely for the purpose of processing your ticket purchase and providing customer support. We do not sell your personal data to third parties.', contentFr: 'Votre vie privée est importante pour nous. Nous collectons des informations personnelles uniquement pour traiter votre achat de billets et fournir une assistance clientèle. Nous ne vendons pas vos données personnelles à des tiers.' } },
    section11: { extra: { titleEn: '11. Governing Law', titleFr: '11. Droit applicable', contentEn: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Aventure Agency LTD is registered.', contentFr: 'Ces conditions générales seront régies et interprétées conformément aux lois de la juridiction dans laquelle Aventure Agency LTD est enregistrée.' } },
    section12: { extra: { titleEn: '12. Contact Us', titleFr: '12. Contactez-nous', contentEn: 'If you have any questions regarding these Terms and Conditions, please contact us at: needhelp@oshaia.com', contentFr: 'Si vous avez des questions concernant ces conditions générales, veuillez nous contacter à : needhelp@oshaia.com' } },
    section13: { extra: { titleEn: '13. Cookie Policy', titleFr: '13. Politique des cookies', contentEn: 'Oshaia uses cookies and similar tracking technologies to enhance your experience on our platform. You may manage your cookie preferences through your browser settings at any time.', contentFr: 'Oshaia utilise des cookies et des technologies de suivi similaires pour améliorer votre expérience sur notre plateforme. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.' } },
  },
};

// ── Field visibility config ─────────────────────────────────────────────────
// Sections NOT listed → show all fields. Sections listed → only true flags are shown.
type SectionFieldFlags = {
  showTitle?: boolean; showSubtitle?: boolean; showDescription?: boolean;
  showButton?: boolean; showImage?: boolean; showGallery?: boolean; showExtra?: boolean;
};
const SECTION_FIELD_CONFIG: Record<string, Record<string, SectionFieldFlags>> = {
  home: {
    hero:      { showImage: true, showGallery: true },   // single image OR multi-slide carousel
    events:    {},
    topSeller: {},
    bestOfSeason: { showTitle: true, showGallery: true },
    partners:     { showTitle: true, showGallery: true },
    platinumlist: { showTitle: true, showSubtitle: true, showImage: true },
  },
  about: {
    hero:        { showTitle: true, showSubtitle: true, showImage: true },
    whoWeAre:    { showTitle: true, showDescription: true, showImage: true },
    services:    { showTitle: true },
    sponsors:    { showTitle: true, showGallery: true },
    whyChooseUs: { showTitle: true },
    cta:         { showTitle: true, showDescription: true, showButton: true },
  },
  help: {
    hero:    { showTitle: true, showSubtitle: true, showImage: true },
    faq:     { showTitle: true, showDescription: true },
    contact: { showTitle: true, showDescription: true, showButton: true }, // + legal inline editor
  },
  terms: {
    hero:     { showTitle: true, showSubtitle: true, showImage: true },
    intro:    { showTitle: true, showDescription: true },
    footer:   {}, // custom inline editor
    section1: {}, section2: {}, section3: {}, section4: {}, section5: {},
    section6: {}, section7: {}, section8: {}, section9: {}, section10: {},
    section11: {}, section12: {}, section13: {},
  },
};

// ── CMS Page definitions ──────────────────────────────────────────────────
const CMS_PAGES = [
  {
    key: 'home',
    label: 'Home Page',
    sections: [
      { key: 'hero', label: 'Hero Banner (Carousel — images + videos)' },
      { key: 'events', label: 'Events Section' },
      { key: 'topSeller', label: 'Top Seller Section' },
      { key: 'bestOfSeason', label: 'Best of the Season (Slider)' },
      { key: 'partners', label: 'Partners (Logo Carousel)' },
      { key: 'platinumlist', label: 'Why Buy / Payment / SEO Text' },
    ],
  },
  {
    key: 'about',
    label: 'About Page',
    sections: [
      { key: 'hero', label: 'Hero Section' },
      { key: 'whoWeAre', label: 'Who We Are' },
      { key: 'services', label: 'Services (What We Offer)' },
      { key: 'sponsors', label: 'Sponsors (Logo Gallery)' },
      { key: 'whyChooseUs', label: 'Why Choose Us' },
      { key: 'cta', label: 'Call to Action' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    sections: [
      { key: 'main', label: 'Footer Brand (Keep in Touch heading)' },
      { key: 'social', label: 'Social Links' },
      { key: 'contact', label: 'Contact Info' },
      { key: 'navigation', label: 'Navigation Columns & Copyright' },
    ],
  },
  {
    key: 'help',
    label: 'Help Center',
    sections: [
      { key: 'hero', label: 'Help Hero' },
      { key: 'faq', label: 'FAQ Content' },
      { key: 'contact', label: 'Contact CTA' },
    ],
  },
  {
    key: 'terms',
    label: 'Terms & Conditions',
    sections: [
      { key: 'hero', label: 'Hero Banner' },
      { key: 'intro', label: 'Intro Card' },
      { key: 'footer', label: 'Footer Note' },
      { key: 'section1', label: '1. Introduction' },
      { key: 'section2', label: '2. Ticket Purchases' },
      { key: 'section3', label: '3. Payment & Pricing' },
      { key: 'section4', label: '4. Refund & Cancellation Policy' },
      { key: 'section5', label: '5. Event Changes & Cancellations' },
      { key: 'section6', label: '6. Attendee Conduct & Prohibited Activities' },
      { key: 'section7', label: '7. User Accounts & Security' },
      { key: 'section8', label: '8. Intellectual Property' },
      { key: 'section9', label: '9. Limitation of Liability' },
      { key: 'section10', label: '10. Privacy & Data Protection' },
      { key: 'section11', label: '11. Governing Law' },
      { key: 'section12', label: '12. Contact Us' },
      { key: 'section13', label: '13. Cookie Policy' },
    ],
  },
  {
    key: 'event',
    label: 'Event Detail (Slug)',
    sections: [
      { key: 'hero', label: 'Hero Carousel' },
      { key: 'tickets', label: 'Tickets Section' },
      { key: 'description', label: 'Description & Artist Bios' },
      { key: 'artists', label: 'Artist Carousel' },
      { key: 'moreInfo', label: 'More Info (Warning & T&C)' },
      { key: 'location', label: 'Location Map' },
      { key: 'sitePlan', label: 'Site Plan' },
      { key: 'songs', label: 'Music Player' },
      { key: 'relatedEvents', label: 'Related Events' },
    ],
  },
];

interface CmsSection {
  _id?: string;
  pageKey: string;
  sectionKey: string;
  label?: string;
  title?: { en: string; fr: string };
  subtitle?: { en: string; fr: string };
  description?: { en: string; fr: string };
  buttonText?: { en: string; fr: string };
  buttonLink?: string;
  image?: string;
  images?: string[];
  extra?: Record<string, any>;
  isVisible?: boolean;
}

export default function AdminCmsPage() {
  const [activePage, setActivePage] = useState(CMS_PAGES[0].key);
  const [content, setContent] = useState<Record<string, CmsSection>>({});
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Record<string, CmsSection>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  // ── Left sidebar: page accordion ─────────────────────────────────────────────
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set([CMS_PAGES[0].key]));
  // visibility: { pageKey: { sectionKey: isVisible } } — loaded lazily per page
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, Record<string, boolean>>>({});
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  const togglePageExpand = (pageKey: string) => {
    setExpandedPages(prev => {
      const next = new Set(prev);
      if (next.has(pageKey)) { next.delete(pageKey); } else { next.add(pageKey); }
      return next;
    });
    // Also load visibility data for this page if not yet loaded
    if (!sectionVisibility[pageKey]) loadPageVisibility(pageKey);
  };

  const loadPageVisibility = async (pageKey: string) => {
    try {
      const { data } = await api.get(`/cms/page/${pageKey}`);
      const vis: Record<string, boolean> = {};
      Object.entries(data.content || {}).forEach(([sk, sec]: [string, any]) => {
        vis[sk] = sec.isVisible !== false;
      });
      setSectionVisibility(prev => ({ ...prev, [pageKey]: vis }));
    } catch {}
  };

  const handleToggleVisibility = async (pageKey: string, sectionKey: string) => {
    const key = `${pageKey}:${sectionKey}`;
    setTogglingKey(key);
    try {
      const { data } = await api.patch(`/cms/page/${pageKey}/${sectionKey}/toggle`);
      const newVisible = data.section?.isVisible !== false;
      setSectionVisibility(prev => ({
        ...prev,
        [pageKey]: { ...(prev[pageKey] || {}), [sectionKey]: newVisible },
      }));
      // If toggling for the active page, update content cache too
      if (pageKey === activePage) {
        setContent(prev => ({
          ...prev,
          [sectionKey]: { ...(prev[sectionKey] || { pageKey, sectionKey }), isVisible: newVisible },
        }));
      }
      clearCmsCache(pageKey);
      toast.success(`"${sectionKey}" is now ${newVisible ? 'visible' : 'hidden'}`);
    } catch {
      toast.error('Toggle failed');
    } finally {
      setTogglingKey(null);
    }
  };

  // ── Inline event manager state ────────────────────────────────────────
  const [cmsEvents, setCmsEvents] = useState<CmsEvent[]>([]);
  const [cmsEventsLoading, setCmsEventsLoading] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CmsEvent | null>(null);

  // ── Top Seller per-slide editor state ────────────────────────────────
  type TopSlide = { image: string; title: string; date: string; price: string };
  const [topSellerSlides, setTopSellerSlides] = useState<TopSlide[]>([]);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState<number | null>(null);
  const [topSellerBottomImages, setTopSellerBottomImages] = useState<string[]>([]);
  const [uploadingBottomIdx, setUploadingBottomIdx] = useState<number | null>(null);

  const updateTopSellerSlides = (newSlides: TopSlide[]) => {
    setTopSellerSlides(newSlides);
    setEditBuffer((prev) => {
      const current: any = prev['topSeller'] || getSectionData('topSeller');
      return {
        ...prev,
        topSeller: { ...current, extra: { ...((current.extra as any) || {}), slides: JSON.stringify(newSlides) } },
      };
    });
  };

  const updateTopSellerBottomImages = (newImages: string[]) => {
    setTopSellerBottomImages(newImages);
    setEditBuffer((prev) => {
      const current: any = prev['topSeller'] || getSectionData('topSeller');
      return {
        ...prev,
        topSeller: { ...current, extra: { ...((current.extra as any) || {}), bottomImages: JSON.stringify(newImages) } },
      };
    });
  };

  const uploadTopSlideImage = async (idx: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingSlideIdx(idx);
    try {
      const { data } = await api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const updated = topSellerSlides.map((s, i) => i === idx ? { ...s, image: data.url } : s);
      updateTopSellerSlides(updated);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingSlideIdx(null);
    }
  };

  const uploadTopBottomImage = async (idx: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingBottomIdx(idx);
    try {
      const { data } = await api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const updated = topSellerBottomImages.map((img, i) => i === idx ? data.url : img);
      updateTopSellerBottomImages(updated);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingBottomIdx(null);
    }
  };

  const fetchCmsEvents = useCallback(async () => {
    setCmsEventsLoading(true);
    try {
      const { data } = await api.get('/events/admin/all');
      setCmsEvents(data.events || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setCmsEventsLoading(false);
    }
  }, []);

  const deleteCmsEvent = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    setDeletingEventId(id);
    try {
      await api.delete(`/events/${id}`);
      setCmsEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingEventId(null);
    }
  };

  const fetchPageContent = useCallback(async (pageKey: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cms/page/${pageKey}`);
      setContent(data.content || {});
      setEditBuffer({});
      setExpandedSection(null);
      // Also sync visibility for this page
      const vis: Record<string, boolean> = {};
      Object.entries(data.content || {}).forEach(([sk, sec]: [string, any]) => {
        vis[sk] = sec.isVisible !== false;
      });
      setSectionVisibility(prev => ({ ...prev, [pageKey]: vis }));
    } catch {
      toast.error('Failed to load CMS content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPageContent(activePage); }, [activePage, fetchPageContent]);

  // Pre-load visibility for all pages on mount (lightweight)
  useEffect(() => {
    CMS_PAGES.forEach(p => loadPageVisibility(p.key));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load events when home/events section is expanded
  useEffect(() => {
    if (activePage === 'home' && expandedSection === 'events') fetchCmsEvents();
  }, [activePage, expandedSection, fetchCmsEvents]);

  // Init top seller slides + bottom images when section expands
  useEffect(() => {
    if (activePage === 'home' && expandedSection === 'topSeller') {
      const extra = (editBuffer['topSeller'] ?? content['topSeller'])?.extra as any;
      const def = SECTION_DEFAULTS.home.topSeller.extra as any;
      // Upper slides
      try {
        const parsed = extra?.slides ? JSON.parse(extra.slides) : null;
        setTopSellerSlides(Array.isArray(parsed) && parsed.length > 0 ? parsed : JSON.parse(def?.slides || '[]'));
      } catch {
        try { setTopSellerSlides(JSON.parse(def?.slides || '[]')); } catch { setTopSellerSlides([]); }
      }
      // Bottom images
      try {
        const parsed = extra?.bottomImages ? JSON.parse(extra.bottomImages) : null;
        setTopSellerBottomImages(Array.isArray(parsed) && parsed.length > 0 ? parsed : JSON.parse(def?.bottomImages || '[]'));
      } catch {
        try { setTopSellerBottomImages(JSON.parse(def?.bottomImages || '[]')); } catch { setTopSellerBottomImages([]); }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, expandedSection]);

  const currentPage = CMS_PAGES.find((p) => p.key === activePage)!;

  // ── Get editable data for a section ──────────────────────────────────
  const getSectionData = (sectionKey: string): CmsSection => {
    if (editBuffer[sectionKey]) return editBuffer[sectionKey];
    const defaults = SECTION_DEFAULTS[activePage]?.[sectionKey] || {};
    const base: CmsSection = {
      pageKey: activePage,
      sectionKey,
      title: { en: '', fr: '' },
      subtitle: { en: '', fr: '' },
      description: { en: '', fr: '' },
      buttonText: { en: '', fr: '' },
      buttonLink: '',
      image: '',
      images: [],
      extra: {},
      ...defaults,
    };
    if (!content[sectionKey]) return base;
    // Merge: DB value wins, but fall back to defaults for empty strings
    const db = content[sectionKey];
    return {
      ...base,
      ...db,
      title: {
        en: db.title?.en || defaults.title?.en || '',
        fr: db.title?.fr || defaults.title?.fr || '',
      },
      subtitle: {
        en: db.subtitle?.en || defaults.subtitle?.en || '',
        fr: db.subtitle?.fr || defaults.subtitle?.fr || '',
      },
      description: {
        en: db.description?.en || defaults.description?.en || '',
        fr: db.description?.fr || defaults.description?.fr || '',
      },
      buttonText: {
        en: db.buttonText?.en || defaults.buttonText?.en || '',
        fr: db.buttonText?.fr || defaults.buttonText?.fr || '',
      },
      buttonLink: db.buttonLink || (defaults as CmsSection).buttonLink || '',
      image: db.image || (defaults as CmsSection).image || '',
      images: (db.images && db.images.length > 0) ? db.images : ((defaults as CmsSection).images || []),
      extra: Object.keys(db.extra || {}).length > 0 ? db.extra : ((defaults as CmsSection).extra || {}),
    };
  };

  const updateBuffer = (sectionKey: string, path: string, value: any) => {
    setEditBuffer((prev) => {
      const current = prev[sectionKey] || getSectionData(sectionKey);
      const clone = JSON.parse(JSON.stringify(current));
      const keys = path.split('.');
      let obj: any = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] = obj[keys[i]] || {};
      obj[keys[keys.length - 1]] = value;
      return { ...prev, [sectionKey]: clone };
    });
  };

  const saveSection = async (sectionKey: string) => {
    const data = editBuffer[sectionKey] || getSectionData(sectionKey);
    setSavingKey(sectionKey);
    try {
      const { data: res } = await api.put(`/cms/page/${activePage}/${sectionKey}`, data);
      setContent((prev) => ({ ...prev, [sectionKey]: res.section }));
      setEditBuffer((prev) => { const n = { ...prev }; delete n[sectionKey]; return n; });
      clearCmsCache(activePage);   // invalidate user-facing cache so next page load fetches fresh data
      toast.success(`"${sectionKey}" saved!`);
    } catch {
      toast.error('Failed to save section');
    } finally {
      setSavingKey(null);
    }
  };

  const uploadImage = async (sectionKey: string, field: 'image' | 'slide', file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingKey(`${sectionKey}-${field}`);
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (field === 'image') {
        updateBuffer(sectionKey, 'image', data.url);
      } else {
        // Use only real saved images (buffer or DB), NOT defaults — defaults are display-only
        const realImages = editBuffer[sectionKey]?.images ?? content[sectionKey]?.images ?? [];
        updateBuffer(sectionKey, 'images', [...realImages, data.url]);
      }
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* ══════════════════════════════════════════════════════════════
          LEFT SIDEBAR — Pages & Sections with visibility toggles
      ══════════════════════════════════════════════════════════════ */}
      <aside className="w-64 min-w-[220px] max-w-[260px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-xs font-bold text-[#112b38] uppercase tracking-wider">Pages</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">Toggle to show/hide sections</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {CMS_PAGES.map((page) => {
            const isExpanded = expandedPages.has(page.key);
            const visForPage = sectionVisibility[page.key] || {};
            return (
              <div key={page.key} className="border-b border-gray-100 last:border-0">
                {/* Page name row */}
                <button
                  type="button"
                  onClick={() => togglePageExpand(page.key)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${activePage === page.key ? 'bg-[#c89c6b]/8' : ''}`}
                >
                  <span className={`text-sm font-semibold truncate ${activePage === page.key ? 'text-[#c89c6b]' : 'text-[#112b38]'}`}>{page.label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ml-1 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
                {/* Section items */}
                {isExpanded && (
                  <div className="pb-1">
                    {page.sections.map(({ key: sKey, label: sLabel }) => {
                      const isVisible = visForPage[sKey] !== false; // default visible
                      const tKey = `${page.key}:${sKey}`;
                      const isToggling = togglingKey === tKey;
                      const isSelected = activePage === page.key && expandedSection === sKey;
                      return (
                        <div
                          key={sKey}
                          className={`flex items-center gap-2 pl-6 pr-3 py-1.5 group cursor-pointer transition-colors ${isSelected ? 'bg-[#112b38]/5' : 'hover:bg-gray-50'} ${!isVisible ? 'opacity-50' : ''}`}
                        >
                          {/* Click label → select section for editing */}
                          <span
                            className="flex-1 text-xs text-gray-600 truncate cursor-pointer"
                            onClick={() => {
                              if (activePage !== page.key) setActivePage(page.key);
                              setExpandedSection(sKey);
                              // Scroll to section editor (handled by existing logic)
                            }}
                            title={sLabel}
                          >
                            {sLabel}
                          </span>
                          {/* Visibility toggle */}
                          <button
                            type="button"
                            title={isVisible ? 'Click to hide this section' : 'Click to show this section'}
                            disabled={isToggling}
                            onClick={() => handleToggleVisibility(page.key, sKey)}
                            className="flex-shrink-0 focus:outline-none"
                          >
                            {isToggling
                              ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                              : isVisible
                                ? <Eye className="w-4 h-4 text-[#c89c6b] group-hover:opacity-80" />
                                : <EyeOff className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                            }
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT PANEL — Content editor
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto min-w-0">

      {/* ── Edit Event Modal ────────────────────────────────────────── */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingEvent(null); }}
        >
          <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col"
            style={{ maxHeight: 'calc(100vh - 24px)' }}>
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white rounded-t-2xl border-b border-gray-200 shrink-0">
              <div className="min-w-0 pr-3">
                <h2 className="text-base sm:text-lg font-bold text-[#112b38] truncate">Edit Event</h2>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{editingEvent.title?.en}</p>
              </div>
              <button type="button" onClick={() => setEditingEvent(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <EventForm mode="edit" initialData={editingEvent as any} onSuccess={() => { setEditingEvent(null); fetchCmsEvents(); }} onCancel={() => setEditingEvent(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">CMS — Content Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Editing: <span className="font-medium text-[#c89c6b]">{CMS_PAGES.find(p => p.key === activePage)?.label}</span></p>
        </div>
        {/* Page quick-select tabs (compact) */}
        <div className="hidden lg:flex flex-wrap gap-1.5">
          {CMS_PAGES.map((page) => (
            <button key={page.key} onClick={() => setActivePage(page.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${activePage === page.key ? 'border-[#c89c6b] text-[#112b38] bg-[#c89c6b]/10' : 'border-gray-200 text-gray-500 hover:text-[#112b38] hover:border-gray-300'}`}>
              {page.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading content...
        </div>
      ) : (
        <div className="space-y-4">
          {currentPage.sections.map(({ key: sectionKey, label }) => {
            const data = getSectionData(sectionKey);
            const isExpanded = expandedSection === sectionKey;
            const isDirty = !!editBuffer[sectionKey];          const _fc = SECTION_FIELD_CONFIG[activePage]?.[sectionKey];
          const show = {
            title:       _fc ? (_fc.showTitle       ?? false) : true,
            subtitle:    _fc ? (_fc.showSubtitle    ?? false) : true,
            description: _fc ? (_fc.showDescription ?? false) : true,
            button:      _fc ? (_fc.showButton      ?? false) : true,
            image:       _fc ? (_fc.showImage       ?? false) : true,
            gallery:     _fc ? (_fc.showGallery     ?? false) : true,
            extra:       _fc ? (_fc.showExtra       ?? false) : true,
          };
            return (
              <div key={sectionKey} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Section header — click to expand */}
                <div className="w-full flex items-center justify-between px-5 py-4">
                  {/* Left: expand toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
                    className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
                  >
                    <span className="font-medium text-gray-800">{label}</span>
                    {isDirty && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Unsaved</span>}
                    {content[sectionKey] && !isDirty && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Saved</span>}
                    {/* Visibility badge */}
                    {(sectionVisibility[activePage]?.[sectionKey] === false) && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-500 border border-red-200 rounded-full text-xs font-medium flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500 ml-1" /> : <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />}
                  </button>
                  {/* Right: visibility toggle button */}
                  <button
                    type="button"
                    title={sectionVisibility[activePage]?.[sectionKey] === false ? 'Section hidden — click to show' : 'Section visible — click to hide'}
                    disabled={togglingKey === `${activePage}:${sectionKey}`}
                    onClick={() => handleToggleVisibility(activePage, sectionKey)}
                    className={`ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex-shrink-0 ${
                      sectionVisibility[activePage]?.[sectionKey] === false
                        ? 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
                        : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                    }`}
                  >
                    {togglingKey === `${activePage}:${sectionKey}`
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : sectionVisibility[activePage]?.[sectionKey] === false
                        ? <><EyeOff className="w-3.5 h-3.5" /> Hidden</>
                        : <><Eye className="w-3.5 h-3.5" /> Visible</>
                    }
                  </button>
                </div>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">

                    {/* Title */}
                    {show.title && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Title (EN)</span>
                        <input
                          value={data.title?.en || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'title.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="English title..."
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Title (FR)</span>
                        <input
                          value={data.title?.fr || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'title.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="French title..."
                        />
                      </label>
                    </div>
                    )}

                    {/* Subtitle */}
                    {show.subtitle && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Subtitle (EN)</span>
                        <input
                          value={data.subtitle?.en || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'subtitle.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="English subtitle..."
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Subtitle (FR)</span>
                        <input
                          value={data.subtitle?.fr || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'subtitle.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="French subtitle..."
                        />
                      </label>
                    </div>
                    )}

                    {/* Description */}
                    {show.description && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description (EN)</span>
                        <textarea
                          rows={3}
                          value={data.description?.en || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'description.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                          placeholder="English description..."
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description (FR)</span>
                        <textarea
                          rows={3}
                          value={data.description?.fr || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'description.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                          placeholder="French description..."
                        />
                      </label>
                    </div>
                    )}

                    {/* Button text + link */}
                    {show.button && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Button Text (EN)</span>
                        <input value={data.buttonText?.en || ''} onChange={(e) => updateBuffer(sectionKey, 'buttonText.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Button Text (FR)</span>
                        <input value={data.buttonText?.fr || ''} onChange={(e) => updateBuffer(sectionKey, 'buttonText.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Button Link</span>
                        <input value={data.buttonLink || ''} onChange={(e) => updateBuffer(sectionKey, 'buttonLink', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="/events" />
                      </label>
                    </div>
                    )}

                    {/* Main image */}
                    {show.image && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Main Image</span>
                      <div className="flex items-start gap-3 flex-wrap">
                        {data.image && (
                          <img
                            src={data.image.startsWith('/uploads')
                              ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${data.image}`
                              : data.image}
                            className="w-28 h-20 object-cover rounded-lg border border-gray-200"
                            alt="Section"
                          />
                        )}
                        <div className="flex-1 space-y-2 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={data.image || ''}
                            onChange={(e) => updateBuffer(sectionKey, 'image', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          />
                          <label className={`flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors w-fit ${uploadingKey === `${sectionKey}-image` ? 'opacity-60 pointer-events-none' : ''}`}>
                            {uploadingKey === `${sectionKey}-image`
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Upload className="w-4 h-4" />}
                            Upload
                            <input type="file" accept="image/*" className="hidden"
                              onChange={(e) => e.target.files?.[0] && uploadImage(sectionKey, 'image', e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Image gallery */}
                    {show.gallery && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {activePage === 'home' && sectionKey === 'hero'
                            ? 'Hero Slides (images or videos — auto-rotates on user side)'
                            : activePage === 'home' && sectionKey === 'partners'
                            ? 'Partner Logos'
                            : activePage === 'home' && sectionKey === 'topSeller'
                            ? 'Slide Images (fallback when no Trending events)'
                            : activePage === 'home' && sectionKey === 'bestOfSeason'
                            ? 'Season Slides (images or videos)'
                            : activePage === 'about' && sectionKey === 'sponsors'
                            ? 'Sponsor Logos'
                            : 'Media Gallery (images or videos)'}
                        </span>
                          <label className={`flex items-center gap-1.5 text-xs text-[#c89c6b] cursor-pointer hover:text-[#b8885a] ${uploadingKey === `${sectionKey}-slide` ? 'opacity-60 pointer-events-none' : ''}`}>
                          {uploadingKey === `${sectionKey}-slide` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                          Add Image / Video
                          <input type="file" accept="image/*,video/*" className="hidden"
                            onChange={(e) => e.target.files?.[0] && uploadImage(sectionKey, 'slide', e.target.files[0])} />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {(data.images || []).map((img, imgIdx) => {
                          const isVid = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(img);
                          const src = img.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${img}` : img;
                          return (
                          <div key={imgIdx} className="relative group">
                            {isVid ? (
                              <div className="w-20 h-16 rounded-lg border border-gray-200 bg-gray-900 flex items-center justify-center relative overflow-hidden">
                                <video src={src} className="w-full h-full object-cover opacity-60" muted />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                                <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-black/60 text-white px-1 rounded">VIDEO</span>
                              </div>
                            ) : (
                              <img
                                src={src}
                                className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                                alt={`slide ${imgIdx}`}
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const realImages = editBuffer[sectionKey]?.images ?? content[sectionKey]?.images ?? [];
                                const newImgs = realImages.filter((_, i) => i !== imgIdx);
                                updateBuffer(sectionKey, 'images', newImgs);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                    )}

                    {/* Extra custom fields — key/value pairs */}
                    {show.extra && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Custom Fields (key → value)</span>
                        <button
                          type="button"
                          onClick={() => {
                            const key = prompt('Field key (e.g. facebook, phone, address):');
                            if (key && key.trim()) {
                              const current = getSectionData(sectionKey).extra || {};
                              updateBuffer(sectionKey, 'extra', { ...current, [key.trim()]: '' });
                            }
                          }}
                          className="flex items-center gap-1 text-xs text-[#c89c6b] hover:text-[#b8885a] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Field
                        </button>
                      </div>
                      {Object.entries(data.extra || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2 mb-2">
                          <span className="w-28 text-xs text-gray-500 font-mono shrink-0">{k}</span>
                          <input
                            value={String(v || '')}
                            onChange={(e) => {
                              const current = getSectionData(sectionKey).extra || {};
                              updateBuffer(sectionKey, 'extra', { ...current, [k]: e.target.value });
                            }}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                            placeholder={`Value for ${k}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current = { ...(getSectionData(sectionKey).extra || {}) };
                              delete current[k];
                              updateBuffer(sectionKey, 'extra', current);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>                    )}
                    {/* Save button */}
                    {(show.title || show.subtitle || show.description || show.button || show.image || show.gallery || show.extra) && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => saveSection(sectionKey)}
                        disabled={savingKey === sectionKey}
                        className="flex items-center gap-2 px-5 py-2 bg-[#112b38] text-white rounded-lg text-sm font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60 border border-[#c89c6b]/20"
                      >
                        {savingKey === sectionKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Section
                      </button>
                    </div>
                    )}

                    {/* ── Top Seller per-slide editor (home/topSeller only) ── */}
                    {activePage === 'home' && sectionKey === 'topSeller' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">Slides ({topSellerSlides.length})</span>
                            <p className="text-xs text-gray-400 mt-0.5">Each slide has its own image, title, date &amp; price. Used as fallback when no Trending events exist.</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateTopSellerSlides([...topSellerSlides, { image: '', title: '', date: '', price: '' }])}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg text-xs font-medium hover:bg-[#b8885a] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Slide
                            </button>
                            <button
                              type="button"
                              onClick={() => saveSection(sectionKey)}
                              disabled={savingKey === sectionKey}
                              className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60"
                            >
                              {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                              Save
                            </button>
                          </div>
                        </div>

                        {topSellerSlides.length === 0 ? (
                          <p className="text-sm text-gray-400 py-2">No slides. Click "Add Slide" to create one.</p>
                        ) : (
                          <div className="space-y-3">
                            {topSellerSlides.map((slide, idx) => (
                              <div key={idx} className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                                {/* Image col */}
                                <div className="shrink-0 flex flex-col gap-1.5">
                                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                    {slide.image ? (
                                      <img
                                        src={slide.image.startsWith('/uploads')
                                          ? `${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${slide.image}`
                                          : slide.image}
                                        className="w-full h-full object-cover" alt=""
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                    )}
                                  </div>
                                  <label className={`flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors ${uploadingSlideIdx === idx ? 'opacity-60 pointer-events-none' : ''}`}>
                                    {uploadingSlideIdx === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                    Upload
                                    <input type="file" accept="image/*" className="hidden"
                                      onChange={(e) => e.target.files?.[0] && uploadTopSlideImage(idx, e.target.files[0])} />
                                  </label>
                                </div>

                                {/* Fields */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div className="sm:col-span-3">
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">Title</span>
                                    <input
                                      value={slide.title}
                                      onChange={(e) => updateTopSellerSlides(topSellerSlides.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))}
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                      placeholder="Event title..."
                                    />
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">Date</span>
                                    <input
                                      value={slide.date}
                                      onChange={(e) => updateTopSellerSlides(topSellerSlides.map((s, i) => i === idx ? { ...s, date: e.target.value } : s))}
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                      placeholder="JUN 15"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">Price</span>
                                    <input
                                      value={slide.price}
                                      onChange={(e) => updateTopSellerSlides(topSellerSlides.map((s, i) => i === idx ? { ...s, price: e.target.value } : s))}
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                      placeholder="500"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <button
                                      type="button"
                                      onClick={() => updateTopSellerSlides(topSellerSlides.filter((_, i) => i !== idx))}
                                      className="flex items-center gap-1 px-2 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ── Bottom Banner Images ────────────────────────── */}
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <span className="text-sm font-semibold text-[#112b38]">Bottom Banner Images ({topSellerBottomImages.length})</span>
                              <p className="text-xs text-gray-400 mt-0.5">Full-width banner carousel shown below the top slider.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => updateTopSellerBottomImages([...topSellerBottomImages, ''])}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg text-xs font-medium hover:bg-[#b8885a] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Image
                            </button>
                          </div>

                          {topSellerBottomImages.length === 0 ? (
                            <p className="text-sm text-gray-400 py-2">No images. Click "Add Image" to add one.</p>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              {topSellerBottomImages.map((img, idx) => (
                                <div key={idx} className="relative group w-32 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                                  {img ? (
                                    <img
                                      src={img.startsWith('/uploads')
                                        ? `${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${img}`
                                        : img}
                                      className="w-full h-full object-cover" alt=""
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                  )}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                    <label className={`cursor-pointer p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors ${uploadingBottomIdx === idx ? 'opacity-60 pointer-events-none' : ''}`}>
                                      {uploadingBottomIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#112b38]" /> : <Upload className="w-3.5 h-3.5 text-[#112b38]" />}
                                      <input type="file" accept="image/*" className="hidden"
                                        onChange={(e) => e.target.files?.[0] && uploadTopBottomImage(idx, e.target.files[0])} />
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => updateTopSellerBottomImages(topSellerBottomImages.filter((_, i) => i !== idx))}
                                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </button>
                                  </div>
                                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">{idx + 1}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── Platinumlist SEO Paragraphs (home/platinumlist only) ── */}
                    {activePage === 'home' && sectionKey === 'platinumlist' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">SEO Description Paragraphs</span>
                            <p className="text-xs text-gray-400 mt-0.5">4 paragraphs shown under the "Mauritius Event Tickets" heading.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => saveSection(sectionKey)}
                            disabled={savingKey === sectionKey}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60"
                          >
                            {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save
                          </button>
                        </div>
                        {([1, 2, 3, 4] as const).map((n) => (
                          <div key={n} className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                            <span className="text-xs font-semibold text-[#112b38]">Paragraph {n}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">EN</span>
                                <textarea
                                  rows={3}
                                  value={(getSectionData(sectionKey) as any)?.extra?.[`desc${n}en`] ?? (editBuffer[sectionKey] as any)?.extra?.[`desc${n}en`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.desc${n}en`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                  placeholder={`English paragraph ${n}...`}
                                />
                              </label>
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">FR</span>
                                <textarea
                                  rows={3}
                                  value={(getSectionData(sectionKey) as any)?.extra?.[`desc${n}fr`] ?? (editBuffer[sectionKey] as any)?.extra?.[`desc${n}fr`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.desc${n}fr`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                  placeholder={`French paragraph ${n}...`}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Help: Legal Box (help/contact only) ──────────── */}
                    {activePage === 'help' && sectionKey === 'contact' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">Legal Box</span>
                            <p className="text-xs text-gray-400 mt-0.5">The right panel showing Terms & Cookie links.</p>
                          </div>
                          <button type="button" onClick={() => saveSection(sectionKey)} disabled={savingKey === sectionKey}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60">
                            {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Title (EN)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.legalTitleEn ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.legalTitleEn', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Legal" />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Title (FR)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.legalTitleFr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.legalTitleFr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Légal" />
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Description (EN)</span>
                              <textarea rows={2} value={(getSectionData(sectionKey) as any)?.extra?.legalDescEn ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.legalDescEn', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                placeholder="Please review our terms..." />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Description (FR)</span>
                              <textarea rows={2} value={(getSectionData(sectionKey) as any)?.extra?.legalDescFr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.legalDescFr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                placeholder="Veuillez consulter nos conditions..." />
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Terms Button Label (EN)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.termsLabelEn ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.termsLabelEn', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Terms & Conditions" />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Terms Button Label (FR)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.termsLabelFr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.termsLabelFr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Conditions générales" />
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Terms Link</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.termsLink ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.termsLink', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="/terms" />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Cookie Button Label (EN)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.cookieLabelEn ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.cookieLabelEn', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Cookie Terms" />
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Cookie Button Label (FR)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.cookieLabelFr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.cookieLabelFr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Politique des cookies" />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Cookie Link</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.cookieLink ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.cookieLink', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="/terms#cookie-terms" />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Terms: Footer Note ──────────────────────────── */}
                    {activePage === 'terms' && sectionKey === 'footer' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">Footer Notes</span>
                            <p className="text-xs text-gray-400 mt-0.5">Two lines shown at the very bottom of the Terms page.</p>
                          </div>
                          <button type="button" onClick={() => saveSection(sectionKey)} disabled={savingKey === sectionKey}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60">
                            {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Note Line 1 (EN)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.note1En ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.note1En', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="© 2026 Oshaia.com, Aventure Agency LTD. All rights reserved." />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Note Line 1 (FR)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.note1Fr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.note1Fr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="© 2026 Oshaia.com, Aventure Agency LTD. Tous droits réservés." />
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Note Line 2 (EN)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.note2En ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.note2En', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="These terms were last updated in March 2026..." />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Note Line 2 (FR)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.note2Fr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.note2Fr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Ces conditions ont été mises à jour en mars 2026..." />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Terms: Section Editor (section1–section13) ──────── */}
                    {activePage === 'terms' && sectionKey.startsWith('section') && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">Section Content</span>
                            <p className="text-xs text-gray-400 mt-0.5">Title and body text displayed for this terms section.</p>
                          </div>
                          <button type="button" onClick={() => saveSection(sectionKey)} disabled={savingKey === sectionKey}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60">
                            {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Title (EN)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.titleEn ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.titleEn', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Section title in English" />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Title (FR)</span>
                              <input value={(getSectionData(sectionKey) as any)?.extra?.titleFr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.titleFr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                placeholder="Section title in French" />
                            </label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Content (EN)</span>
                              <textarea rows={6} value={(getSectionData(sectionKey) as any)?.extra?.contentEn ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.contentEn', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-y"
                                placeholder="Section body text in English" />
                            </label>
                            <label className="block">
                              <span className="text-xs text-gray-500 mb-1 block">Content (FR)</span>
                              <textarea rows={6} value={(getSectionData(sectionKey) as any)?.extra?.contentFr ?? ''}
                                onChange={(e) => updateBuffer(sectionKey, 'extra.contentFr', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-y"
                                placeholder="Section body text in French" />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── About: Who We Are — second paragraph ──────────── */}
                    {activePage === 'about' && sectionKey === 'whoWeAre' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">Second Paragraph</span>
                            <p className="text-xs text-gray-400 mt-0.5">Second text block shown below the main description.</p>
                          </div>
                          <button type="button" onClick={() => saveSection(sectionKey)} disabled={savingKey === sectionKey}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60">
                            {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="block">
                            <span className="text-xs text-gray-500 mb-1 block">EN</span>
                            <textarea rows={3}
                              value={(getSectionData(sectionKey) as any)?.extra?.desc2En ?? ''}
                              onChange={(e) => updateBuffer(sectionKey, 'extra.desc2En', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                              placeholder="English second paragraph..." />
                          </label>
                          <label className="block">
                            <span className="text-xs text-gray-500 mb-1 block">FR</span>
                            <textarea rows={3}
                              value={(getSectionData(sectionKey) as any)?.extra?.desc2Fr ?? ''}
                              onChange={(e) => updateBuffer(sectionKey, 'extra.desc2Fr', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                              placeholder="French second paragraph..." />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* ── About: Services / WhyChooseUs — 3 card editor ─── */}
                    {activePage === 'about' && (sectionKey === 'services' || sectionKey === 'whyChooseUs') && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">Cards (3)</span>
                            <p className="text-xs text-gray-400 mt-0.5">Title and description for each card, in both languages.</p>
                          </div>
                          <button type="button" onClick={() => saveSection(sectionKey)} disabled={savingKey === sectionKey}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60">
                            {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                          </button>
                        </div>
                        {([1, 2, 3] as const).map((n) => (
                          <div key={n} className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                            <span className="text-xs font-semibold text-[#112b38]">Card {n}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">Title (EN)</span>
                                <input value={(getSectionData(sectionKey) as any)?.extra?.[`card${n}titleEn`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.card${n}titleEn`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                  placeholder={`Card ${n} title (English)...`} />
                              </label>
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">Title (FR)</span>
                                <input value={(getSectionData(sectionKey) as any)?.extra?.[`card${n}titleFr`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.card${n}titleFr`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                  placeholder={`Card ${n} title (French)...`} />
                              </label>
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">Description (EN)</span>
                                <textarea rows={2}
                                  value={(getSectionData(sectionKey) as any)?.extra?.[`card${n}descEn`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.card${n}descEn`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                  placeholder={`Card ${n} description (English)...`} />
                              </label>
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">Description (FR)</span>
                                <textarea rows={2}
                                  value={(getSectionData(sectionKey) as any)?.extra?.[`card${n}descFr`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.card${n}descFr`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                  placeholder={`Card ${n} description (French)...`} />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Inline Event Manager (home/events only) ───────── */}
                    {activePage === 'home' && sectionKey === 'events' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#112b38]">Event Cards ({cmsEvents.length})</span>
                          <Link
                            href="/admin/events/new"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg text-xs font-medium hover:bg-[#b8885a] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Event
                          </Link>
                        </div>

                        {cmsEventsLoading ? (
                          <div className="flex items-center gap-2 text-gray-400 py-4 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading events...
                          </div>
                        ) : cmsEvents.length === 0 ? (
                          <p className="text-sm text-gray-400 py-4">No events yet. Add your first event.</p>
                        ) : (
                          <div className="space-y-3">
                            {cmsEvents.map((ev) => (
                              <div key={ev._id} className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                                {/* Cover image */}
                                <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                  {ev.coverImage ? (
                                    <img
                                      src={getImageUrl(ev.coverImage)}
                                      alt={ev.title?.en}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                  )}
                                </div>

                                {/* Fields */}
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-gray-800 truncate">{ev.title?.en || '—'}</p>
                                      <p className="text-xs text-gray-500 truncate">{ev.title?.fr || '—'}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {ev.isPublic
                                        ? <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium"><Globe className="w-3 h-3" />Public</span>
                                        : <span className="flex items-center gap-0.5 text-xs text-gray-400 font-medium"><EyeOff className="w-3 h-3" />Hidden</span>
                                      }
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                                    <span><strong>Category:</strong> {ev.category}</span>
                                    {ev.badge && <span><strong>Badge:</strong> {ev.badge}</span>}
                                    {ev.startDate && (
                                      <span className="flex items-center gap-0.5">
                                        <CalendarDays className="w-3 h-3" />
                                        {new Date(ev.startDate).toLocaleDateString()}
                                        {ev.endDate ? ` → ${new Date(ev.endDate).toLocaleDateString()}` : ''}
                                      </span>
                                    )}
                                    {ev.startTime && <span><strong>Time:</strong> {ev.startTime}{ev.endTime ? ` – ${ev.endTime}` : ''}</span>}
                                    {ev.venue?.en && <span><strong>Venue:</strong> {ev.venue.en}</span>}
                                    {ev.address?.en && <span><strong>Address:</strong> {ev.address.en}</span>}
                                    {ev.description?.en && (
                                      <span className="w-full"><strong>Desc (EN):</strong> {ev.description.en.slice(0, 80)}{ev.description.en.length > 80 ? '…' : ''}</span>
                                    )}
                                    {ev.description?.fr && (
                                      <span className="w-full"><strong>Desc (FR):</strong> {ev.description.fr.slice(0, 80)}{ev.description.fr.length > 80 ? '…' : ''}</span>
                                    )}
                                    {ev.ticketTypes && ev.ticketTypes.length > 0 && (
                                      <span className="w-full">
                                        <strong>Tickets:</strong>{' '}
                                        {ev.ticketTypes.map((t, i) => (
                                          <span key={i}>{t.name?.en} ({t.currency} {t.price}, {t.totalSeats} seats){i < ev.ticketTypes!.length - 1 ? ' · ' : ''}</span>
                                        ))}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setEditingEvent(ev)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-[#112b38] border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteCmsEvent(ev._id)}
                                    disabled={deletingEventId === ev._id}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    {deletingEventId === ev._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
