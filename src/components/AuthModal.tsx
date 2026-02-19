'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

interface Country {
    code: string;
    name: string;
    flag: string;
    isoCode: string;
}

const countries: Country[] = [
    // North America
    { code: '+1', name: 'United States', flag: 'https://flagcdn.com/us.svg', isoCode: 'us' },
    { code: '+1', name: 'Canada', flag: 'https://flagcdn.com/ca.svg', isoCode: 'ca' },
    { code: '+52', name: 'Mexico', flag: 'https://flagcdn.com/mx.svg', isoCode: 'mx' },
    
    // Europe
    { code: '+44', name: 'United Kingdom', flag: 'https://flagcdn.com/gb.svg', isoCode: 'gb' },
    { code: '+33', name: 'France', flag: 'https://flagcdn.com/fr.svg', isoCode: 'fr' },
    { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/de.svg', isoCode: 'de' },
    { code: '+39', name: 'Italy', flag: 'https://flagcdn.com/it.svg', isoCode: 'it' },
    { code: '+34', name: 'Spain', flag: 'https://flagcdn.com/es.svg', isoCode: 'es' },
    { code: '+7', name: 'Russia', flag: 'https://flagcdn.com/ru.svg', isoCode: 'ru' },
    { code: '+31', name: 'Netherlands', flag: 'https://flagcdn.com/nl.svg', isoCode: 'nl' },
    { code: '+41', name: 'Switzerland', flag: 'https://flagcdn.com/ch.svg', isoCode: 'ch' },
    { code: '+46', name: 'Sweden', flag: 'https://flagcdn.com/se.svg', isoCode: 'se' },
    { code: '+47', name: 'Norway', flag: 'https://flagcdn.com/no.svg', isoCode: 'no' },
    { code: '+45', name: 'Denmark', flag: 'https://flagcdn.com/dk.svg', isoCode: 'dk' },
    { code: '+358', name: 'Finland', flag: 'https://flagcdn.com/fi.svg', isoCode: 'fi' },
    { code: '+48', name: 'Poland', flag: 'https://flagcdn.com/pl.svg', isoCode: 'pl' },
    { code: '+420', name: 'Czech Republic', flag: 'https://flagcdn.com/cz.svg', isoCode: 'cz' },
    { code: '+43', name: 'Austria', flag: 'https://flagcdn.com/at.svg', isoCode: 'at' },
    { code: '+32', name: 'Belgium', flag: 'https://flagcdn.com/be.svg', isoCode: 'be' },
    { code: '+351', name: 'Portugal', flag: 'https://flagcdn.com/pt.svg', isoCode: 'pt' },
    { code: '+30', name: 'Greece', flag: 'https://flagcdn.com/gr.svg', isoCode: 'gr' },
    { code: '+353', name: 'Ireland', flag: 'https://flagcdn.com/ie.svg', isoCode: 'ie' },
    { code: '+381', name: 'Serbia', flag: 'https://flagcdn.com/rs.svg', isoCode: 'rs' },
    { code: '+386', name: 'Slovenia', flag: 'https://flagcdn.com/si.svg', isoCode: 'si' },
    { code: '+421', name: 'Slovakia', flag: 'https://flagcdn.com/sk.svg', isoCode: 'sk' },
    { code: '+385', name: 'Croatia', flag: 'https://flagcdn.com/hr.svg', isoCode: 'hr' },
    { code: '+40', name: 'Romania', flag: 'https://flagcdn.com/ro.svg', isoCode: 'ro' },
    { code: '+36', name: 'Hungary', flag: 'https://flagcdn.com/hu.svg', isoCode: 'hu' },
    { code: '+380', name: 'Ukraine', flag: 'https://flagcdn.com/ua.svg', isoCode: 'ua' },
    { code: '+370', name: 'Lithuania', flag: 'https://flagcdn.com/lt.svg', isoCode: 'lt' },
    { code: '+371', name: 'Latvia', flag: 'https://flagcdn.com/lv.svg', isoCode: 'lv' },
    { code: '+372', name: 'Estonia', flag: 'https://flagcdn.com/ee.svg', isoCode: 'ee' },
    { code: '+373', name: 'Moldova', flag: 'https://flagcdn.com/md.svg', isoCode: 'md' },
    { code: '+374', name: 'Armenia', flag: 'https://flagcdn.com/am.svg', isoCode: 'am' },
    { code: '+375', name: 'Belarus', flag: 'https://flagcdn.com/by.svg', isoCode: 'by' },
    { code: '+376', name: 'Andorra', flag: 'https://flagcdn.com/ad.svg', isoCode: 'ad' },
    { code: '+377', name: 'Monaco', flag: 'https://flagcdn.com/mc.svg', isoCode: 'mc' },
    { code: '+378', name: 'San Marino', flag: 'https://flagcdn.com/sm.svg', isoCode: 'sm' },
    { code: '+379', name: 'Vatican City', flag: 'https://flagcdn.com/va.svg', isoCode: 'va' },
    { code: '+382', name: 'Montenegro', flag: 'https://flagcdn.com/me.svg', isoCode: 'me' },
    { code: '+383', name: 'Kosovo', flag: 'https://flagcdn.com/xk.svg', isoCode: 'xk' },
    { code: '+385', name: 'Croatia', flag: 'https://flagcdn.com/hr.svg', isoCode: 'hr' },
    { code: '+386', name: 'Slovenia', flag: 'https://flagcdn.com/si.svg', isoCode: 'si' },
    { code: '+387', name: 'Bosnia and Herzegovina', flag: 'https://flagcdn.com/ba.svg', isoCode: 'ba' },
    { code: '+389', name: 'North Macedonia', flag: 'https://flagcdn.com/mk.svg', isoCode: 'mk' },
    { code: '+39', name: 'Italy', flag: 'https://flagcdn.com/it.svg', isoCode: 'it' },
    { code: '+40', name: 'Romania', flag: 'https://flagcdn.com/ro.svg', isoCode: 'ro' },
    { code: '+41', name: 'Switzerland', flag: 'https://flagcdn.com/ch.svg', isoCode: 'ch' },
    { code: '+42', name: 'Czech Republic', flag: 'https://flagcdn.com/cz.svg', isoCode: 'cz' },
    { code: '+43', name: 'Austria', flag: 'https://flagcdn.com/at.svg', isoCode: 'at' },
    { code: '+44', name: 'United Kingdom', flag: 'https://flagcdn.com/gb.svg', isoCode: 'gb' },
    { code: '+45', name: 'Denmark', flag: 'https://flagcdn.com/dk.svg', isoCode: 'dk' },
    { code: '+46', name: 'Sweden', flag: 'https://flagcdn.com/se.svg', isoCode: 'se' },
    { code: '+47', name: 'Norway', flag: 'https://flagcdn.com/no.svg', isoCode: 'no' },
    { code: '+48', name: 'Poland', flag: 'https://flagcdn.com/pl.svg', isoCode: 'pl' },
    { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/de.svg', isoCode: 'de' },
    
    // Asia
    { code: '+86', name: 'China', flag: 'https://flagcdn.com/cn.svg', isoCode: 'cn' },
    { code: '+91', name: 'India', flag: 'https://flagcdn.com/in.svg', isoCode: 'in' },
    { code: '+81', name: 'Japan', flag: 'https://flagcdn.com/jp.svg', isoCode: 'jp' },
    { code: '+82', name: 'South Korea', flag: 'https://flagcdn.com/kr.svg', isoCode: 'kr' },
    { code: '+66', name: 'Thailand', flag: 'https://flagcdn.com/th.svg', isoCode: 'th' },
    { code: '+65', name: 'Singapore', flag: 'https://flagcdn.com/sg.svg', isoCode: 'sg' },
    { code: '+60', name: 'Malaysia', flag: 'https://flagcdn.com/my.svg', isoCode: 'my' },
    { code: '+63', name: 'Philippines', flag: 'https://flagcdn.com/ph.svg', isoCode: 'ph' },
    { code: '+62', name: 'Indonesia', flag: 'https://flagcdn.com/id.svg', isoCode: 'id' },
    { code: '+84', name: 'Vietnam', flag: 'https://flagcdn.com/vn.svg', isoCode: 'vn' },
    { code: '+95', name: 'Myanmar', flag: 'https://flagcdn.com/mm.svg', isoCode: 'mm' },
    { code: '+855', name: 'Cambodia', flag: 'https://flagcdn.com/kh.svg', isoCode: 'kh' },
    { code: '+856', name: 'Laos', flag: 'https://flagcdn.com/la.svg', isoCode: 'la' },
    { code: '+880', name: 'Bangladesh', flag: 'https://flagcdn.com/bd.svg', isoCode: 'bd' },
    { code: '+92', name: 'Pakistan', flag: 'https://flagcdn.com/pk.svg', isoCode: 'pk' },
    { code: '+93', name: 'Afghanistan', flag: 'https://flagcdn.com/af.svg', isoCode: 'af' },
    { code: '+94', name: 'Sri Lanka', flag: 'https://flagcdn.com/lk.svg', isoCode: 'lk' },
    { code: '+98', name: 'Iran', flag: 'https://flagcdn.com/ir.svg', isoCode: 'ir' },
    { code: '+964', name: 'Iraq', flag: 'https://flagcdn.com/iq.svg', isoCode: 'iq' },
    { code: '+962', name: 'Jordan', flag: 'https://flagcdn.com/jo.svg', isoCode: 'jo' },
    { code: '+961', name: 'Lebanon', flag: 'https://flagcdn.com/lb.svg', isoCode: 'lb' },
    { code: '+966', name: 'Saudi Arabia', flag: 'https://flagcdn.com/sa.svg', isoCode: 'sa' },
    { code: '+971', name: 'United Arab Emirates', flag: 'https://flagcdn.com/ae.svg', isoCode: 'ae' },
    { code: '+972', name: 'Israel', flag: 'https://flagcdn.com/il.svg', isoCode: 'il' },
    { code: '+90', name: 'Turkey', flag: 'https://flagcdn.com/tr.svg', isoCode: 'tr' },
    { code: '+960', name: 'Maldives', flag: 'https://flagcdn.com/mv.svg', isoCode: 'mv' },
    { code: '+961', name: 'Lebanon', flag: 'https://flagcdn.com/lb.svg', isoCode: 'lb' },
    { code: '+962', name: 'Jordan', flag: 'https://flagcdn.com/jo.svg', isoCode: 'jo' },
    { code: '+963', name: 'Syria', flag: 'https://flagcdn.com/sy.svg', isoCode: 'sy' },
    { code: '+964', name: 'Iraq', flag: 'https://flagcdn.com/iq.svg', isoCode: 'iq' },
    { code: '+965', name: 'Kuwait', flag: 'https://flagcdn.com/kw.svg', isoCode: 'kw' },
    { code: '+966', name: 'Saudi Arabia', flag: 'https://flagcdn.com/sa.svg', isoCode: 'sa' },
    { code: '+967', name: 'Yemen', flag: 'https://flagcdn.com/ye.svg', isoCode: 'ye' },
    { code: '+968', name: 'Oman', flag: 'https://flagcdn.com/om.svg', isoCode: 'om' },
    { code: '+970', name: 'Palestine', flag: 'https://flagcdn.com/ps.svg', isoCode: 'ps' },
    { code: '+971', name: 'United Arab Emirates', flag: 'https://flagcdn.com/ae.svg', isoCode: 'ae' },
    { code: '+972', name: 'Israel', flag: 'https://flagcdn.com/il.svg', isoCode: 'il' },
    { code: '+973', name: 'Bahrain', flag: 'https://flagcdn.com/bh.svg', isoCode: 'bh' },
    { code: '+974', name: 'Qatar', flag: 'https://flagcdn.com/qa.svg', isoCode: 'qa' },
    { code: '+975', name: 'Bhutan', flag: 'https://flagcdn.com/bt.svg', isoCode: 'bt' },
    { code: '+976', name: 'Mongolia', flag: 'https://flagcdn.com/mn.svg', isoCode: 'mn' },
    { code: '+977', name: 'Nepal', flag: 'https://flagcdn.com/np.svg', isoCode: 'np' },
    { code: '+992', name: 'Tajikistan', flag: 'https://flagcdn.com/tj.svg', isoCode: 'tj' },
    { code: '+993', name: 'Turkmenistan', flag: 'https://flagcdn.com/tm.svg', isoCode: 'tm' },
    { code: '+994', name: 'Azerbaijan', flag: 'https://flagcdn.com/az.svg', isoCode: 'az' },
    { code: '+995', name: 'Georgia', flag: 'https://flagcdn.com/ge.svg', isoCode: 'ge' },
    { code: '+996', name: 'Kyrgyzstan', flag: 'https://flagcdn.com/kg.svg', isoCode: 'kg' },
    { code: '+998', name: 'Uzbekistan', flag: 'https://flagcdn.com/uz.svg', isoCode: 'uz' },
    
    // Africa
    { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/eg.svg', isoCode: 'eg' },
    { code: '+27', name: 'South Africa', flag: 'https://flagcdn.com/za.svg', isoCode: 'za' },
    { code: '+212', name: 'Morocco', flag: 'https://flagcdn.com/ma.svg', isoCode: 'ma' },
    { code: '+213', name: 'Algeria', flag: 'https://flagcdn.com/dz.svg', isoCode: 'dz' },
    { code: '+216', name: 'Tunisia', flag: 'https://flagcdn.com/tn.svg', isoCode: 'tn' },
    { code: '+218', name: 'Libya', flag: 'https://flagcdn.com/ly.svg', isoCode: 'ly' },
    { code: '+220', name: 'Gambia', flag: 'https://flagcdn.com/gm.svg', isoCode: 'gm' },
    { code: '+221', name: 'Senegal', flag: 'https://flagcdn.com/sn.svg', isoCode: 'sn' },
    { code: '+222', name: 'Mauritania', flag: 'https://flagcdn.com/mr.svg', isoCode: 'mr' },
    { code: '+223', name: 'Mali', flag: 'https://flagcdn.com/ml.svg', isoCode: 'ml' },
    { code: '+224', name: 'Guinea', flag: 'https://flagcdn.com/gn.svg', isoCode: 'gn' },
    { code: '+225', name: "Côte d'Ivoire", flag: 'https://flagcdn.com/ci.svg', isoCode: 'ci' },
    { code: '+226', name: 'Burkina Faso', flag: 'https://flagcdn.com/bf.svg', isoCode: 'bf' },
    { code: '+227', name: 'Niger', flag: 'https://flagcdn.com/ne.svg', isoCode: 'ne' },
    { code: '+228', name: 'Togo', flag: 'https://flagcdn.com/tg.svg', isoCode: 'tg' },
    { code: '+229', name: 'Benin', flag: 'https://flagcdn.com/bj.svg', isoCode: 'bj' },
    { code: '+230', name: 'Mauritius', flag: 'https://flagcdn.com/mu.svg', isoCode: 'mu' },
    { code: '+231', name: 'Liberia', flag: 'https://flagcdn.com/lr.svg', isoCode: 'lr' },
    { code: '+232', name: 'Sierra Leone', flag: 'https://flagcdn.com/sl.svg', isoCode: 'sl' },
    { code: '+233', name: 'Ghana', flag: 'https://flagcdn.com/gh.svg', isoCode: 'gh' },
    { code: '+234', name: 'Nigeria', flag: 'https://flagcdn.com/ng.svg', isoCode: 'ng' },
    { code: '+235', name: 'Chad', flag: 'https://flagcdn.com/td.svg', isoCode: 'td' },
    { code: '+236', name: 'Central African Republic', flag: 'https://flagcdn.com/cf.svg', isoCode: 'cf' },
    { code: '+237', name: 'Cameroon', flag: 'https://flagcdn.com/cm.svg', isoCode: 'cm' },
    { code: '+238', name: 'Cape Verde', flag: 'https://flagcdn.com/cv.svg', isoCode: 'cv' },
    { code: '+239', name: 'São Tomé and Príncipe', flag: 'https://flagcdn.com/st.svg', isoCode: 'st' },
    { code: '+240', name: 'Equatorial Guinea', flag: 'https://flagcdn.com/gq.svg', isoCode: 'gq' },
    { code: '+241', name: 'Gabon', flag: 'https://flagcdn.com/ga.svg', isoCode: 'ga' },
    { code: '+242', name: 'Republic of the Congo', flag: 'https://flagcdn.com/cg.svg', isoCode: 'cg' },
    { code: '+243', name: 'DR Congo', flag: 'https://flagcdn.com/cd.svg', isoCode: 'cd' },
    { code: '+244', name: 'Angola', flag: 'https://flagcdn.com/ao.svg', isoCode: 'ao' },
    { code: '+245', name: 'Guinea-Bissau', flag: 'https://flagcdn.com/gw.svg', isoCode: 'gw' },
    { code: '+246', name: 'British Indian Ocean Territory', flag: 'https://flagcdn.com/io.svg', isoCode: 'io' },
    { code: '+248', name: 'Seychelles', flag: 'https://flagcdn.com/sc.svg', isoCode: 'sc' },
    { code: '+249', name: 'Sudan', flag: 'https://flagcdn.com/sd.svg', isoCode: 'sd' },
    { code: '+250', name: 'Rwanda', flag: 'https://flagcdn.com/rw.svg', isoCode: 'rw' },
    { code: '+251', name: 'Ethiopia', flag: 'https://flagcdn.com/et.svg', isoCode: 'et' },
    { code: '+252', name: 'Somalia', flag: 'https://flagcdn.com/so.svg', isoCode: 'so' },
    { code: '+253', name: 'Djibouti', flag: 'https://flagcdn.com/dj.svg', isoCode: 'dj' },
    { code: '+254', name: 'Kenya', flag: 'https://flagcdn.com/ke.svg', isoCode: 'ke' },
    { code: '+255', name: 'Tanzania', flag: 'https://flagcdn.com/tz.svg', isoCode: 'tz' },
    { code: '+256', name: 'Uganda', flag: 'https://flagcdn.com/ug.svg', isoCode: 'ug' },
    { code: '+257', name: 'Burundi', flag: 'https://flagcdn.com/bi.svg', isoCode: 'bi' },
    { code: '+258', name: 'Mozambique', flag: 'https://flagcdn.com/mz.svg', isoCode: 'mz' },
    { code: '+260', name: 'Zambia', flag: 'https://flagcdn.com/zm.svg', isoCode: 'zm' },
    { code: '+261', name: 'Madagascar', flag: 'https://flagcdn.com/mg.svg', isoCode: 'mg' },
    { code: '+262', name: 'Réunion', flag: 'https://flagcdn.com/re.svg', isoCode: 're' },
    { code: '+263', name: 'Zimbabwe', flag: 'https://flagcdn.com/zw.svg', isoCode: 'zw' },
    { code: '+264', name: 'Namibia', flag: 'https://flagcdn.com/na.svg', isoCode: 'na' },
    { code: '+265', name: 'Malawi', flag: 'https://flagcdn.com/mw.svg', isoCode: 'mw' },
    { code: '+266', name: 'Lesotho', flag: 'https://flagcdn.com/ls.svg', isoCode: 'ls' },
    { code: '+267', name: 'Botswana', flag: 'https://flagcdn.com/bw.svg', isoCode: 'bw' },
    { code: '+268', name: 'Eswatini', flag: 'https://flagcdn.com/sz.svg', isoCode: 'sz' },
    { code: '+269', name: 'Comoros', flag: 'https://flagcdn.com/km.svg', isoCode: 'km' },
    { code: '+290', name: 'Saint Helena', flag: 'https://flagcdn.com/sh.svg', isoCode: 'sh' },
    { code: '+291', name: 'Eritrea', flag: 'https://flagcdn.com/er.svg', isoCode: 'er' },
    
    // South America
    { code: '+54', name: 'Argentina', flag: 'https://flagcdn.com/ar.svg', isoCode: 'ar' },
    { code: '+55', name: 'Brazil', flag: 'https://flagcdn.com/br.svg', isoCode: 'br' },
    { code: '+56', name: 'Chile', flag: 'https://flagcdn.com/cl.svg', isoCode: 'cl' },
    { code: '+57', name: 'Colombia', flag: 'https://flagcdn.com/co.svg', isoCode: 'co' },
    { code: '+58', name: 'Venezuela', flag: 'https://flagcdn.com/ve.svg', isoCode: 've' },
    { code: '+591', name: 'Bolivia', flag: 'https://flagcdn.com/bo.svg', isoCode: 'bo' },
    { code: '+592', name: 'Guyana', flag: 'https://flagcdn.com/gy.svg', isoCode: 'gy' },
    { code: '+593', name: 'Ecuador', flag: 'https://flagcdn.com/ec.svg', isoCode: 'ec' },
    { code: '+594', name: 'French Guiana', flag: 'https://flagcdn.com/gf.svg', isoCode: 'gf' },
    { code: '+595', name: 'Paraguay', flag: 'https://flagcdn.com/py.svg', isoCode: 'py' },
    { code: '+596', name: 'Martinique', flag: 'https://flagcdn.com/mq.svg', isoCode: 'mq' },
    { code: '+597', name: 'Suriname', flag: 'https://flagcdn.com/sr.svg', isoCode: 'sr' },
    { code: '+598', name: 'Uruguay', flag: 'https://flagcdn.com/uy.svg', isoCode: 'uy' },
    
    // Oceania
    { code: '+61', name: 'Australia', flag: 'https://flagcdn.com/au.svg', isoCode: 'au' },
    { code: '+64', name: 'New Zealand', flag: 'https://flagcdn.com/nz.svg', isoCode: 'nz' },
    { code: '+672', name: 'Norfolk Island', flag: 'https://flagcdn.com/nf.svg', isoCode: 'nf' },
    { code: '+673', name: 'Brunei', flag: 'https://flagcdn.com/bn.svg', isoCode: 'bn' },
    { code: '+674', name: 'Nauru', flag: 'https://flagcdn.com/nr.svg', isoCode: 'nr' },
    { code: '+675', name: 'Papua New Guinea', flag: 'https://flagcdn.com/pg.svg', isoCode: 'pg' },
    { code: '+676', name: 'Tonga', flag: 'https://flagcdn.com/to.svg', isoCode: 'to' },
    { code: '+677', name: 'Solomon Islands', flag: 'https://flagcdn.com/sb.svg', isoCode: 'sb' },
    { code: '+678', name: 'Vanuatu', flag: 'https://flagcdn.com/vu.svg', isoCode: 'vu' },
    { code: '+679', name: 'Fiji', flag: 'https://flagcdn.com/fj.svg', isoCode: 'fj' },
    { code: '+680', name: 'Palau', flag: 'https://flagcdn.com/pw.svg', isoCode: 'pw' },
    { code: '+681', name: 'Wallis and Futuna', flag: 'https://flagcdn.com/wf.svg', isoCode: 'wf' },
    { code: '+682', name: 'Cook Islands', flag: 'https://flagcdn.com/ck.svg', isoCode: 'ck' },
    { code: '+683', name: 'Niue', flag: 'https://flagcdn.com/nu.svg', isoCode: 'nu' },
    { code: '+685', name: 'Samoa', flag: 'https://flagcdn.com/ws.svg', isoCode: 'ws' },
    { code: '+686', name: 'Kiribati', flag: 'https://flagcdn.com/ki.svg', isoCode: 'ki' },
    { code: '+687', name: 'New Caledonia', flag: 'https://flagcdn.com/nc.svg', isoCode: 'nc' },
    { code: '+688', name: 'Tuvalu', flag: 'https://flagcdn.com/tv.svg', isoCode: 'tv' },
    { code: '+689', name: 'French Polynesia', flag: 'https://flagcdn.com/pf.svg', isoCode: 'pf' },
    
    // Caribbean
    { code: '+1', name: 'Bahamas', flag: 'https://flagcdn.com/bs.svg', isoCode: 'bs' },
    { code: '+1', name: 'Barbados', flag: 'https://flagcdn.com/bb.svg', isoCode: 'bb' },
    { code: '+1', name: 'Cuba', flag: 'https://flagcdn.com/cu.svg', isoCode: 'cu' },
    { code: '+1', name: 'Dominican Republic', flag: 'https://flagcdn.com/do.svg', isoCode: 'do' },
    { code: '+1', name: 'Haiti', flag: 'https://flagcdn.com/ht.svg', isoCode: 'ht' },
    { code: '+1', name: 'Jamaica', flag: 'https://flagcdn.com/jm.svg', isoCode: 'jm' },
    { code: '+1', name: 'Puerto Rico', flag: 'https://flagcdn.com/pr.svg', isoCode: 'pr' },
    { code: '+1', name: 'Trinidad and Tobago', flag: 'https://flagcdn.com/tt.svg', isoCode: 'tt' },
    { code: '+1', name: 'US Virgin Islands', flag: 'https://flagcdn.com/vi.svg', isoCode: 'vi' },
    { code: '+1', name: 'British Virgin Islands', flag: 'https://flagcdn.com/vg.svg', isoCode: 'vg' },
    { code: '+1', name: 'Cayman Islands', flag: 'https://flagcdn.com/ky.svg', isoCode: 'ky' },
    { code: '+1', name: 'Bermuda', flag: 'https://flagcdn.com/bm.svg', isoCode: 'bm' },
    { code: '+297', name: 'Aruba', flag: 'https://flagcdn.com/aw.svg', isoCode: 'aw' },
    { code: '+298', name: 'Faroe Islands', flag: 'https://flagcdn.com/fo.svg', isoCode: 'fo' },
    { code: '+299', name: 'Greenland', flag: 'https://flagcdn.com/gl.svg', isoCode: 'gl' },
    { code: '+345', name: 'Cayman Islands', flag: 'https://flagcdn.com/ky.svg', isoCode: 'ky' },
    { code: '+441', name: 'Bermuda', flag: 'https://flagcdn.com/bm.svg', isoCode: 'bm' },
    { code: '+473', name: 'Grenada', flag: 'https://flagcdn.com/gd.svg', isoCode: 'gd' },
    { code: '+590', name: 'Guadeloupe', flag: 'https://flagcdn.com/gp.svg', isoCode: 'gp' },
    { code: '+596', name: 'Martinique', flag: 'https://flagcdn.com/mq.svg', isoCode: 'mq' },
    { code: '+758', name: 'Saint Lucia', flag: 'https://flagcdn.com/lc.svg', isoCode: 'lc' },
    { code: '+784', name: 'Saint Vincent and the Grenadines', flag: 'https://flagcdn.com/vc.svg', isoCode: 'vc' },
    { code: '+809', name: 'Dominican Republic', flag: 'https://flagcdn.com/do.svg', isoCode: 'do' },
    { code: '+829', name: 'Dominican Republic', flag: 'https://flagcdn.com/do.svg', isoCode: 'do' },
    { code: '+849', name: 'Dominican Republic', flag: 'https://flagcdn.com/do.svg', isoCode: 'do' },
    { code: '+868', name: 'Trinidad and Tobago', flag: 'https://flagcdn.com/tt.svg', isoCode: 'tt' },
    { code: '+876', name: 'Jamaica', flag: 'https://flagcdn.com/jm.svg', isoCode: 'jm' },
    { code: '+939', name: 'Puerto Rico', flag: 'https://flagcdn.com/pr.svg', isoCode: 'pr' },
];
// Sort countries alphabetically by name
const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

export default function AuthModal({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) {
    const { t } = useLanguage();
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+230'); // Default to Mauritius
    const [showPassword, setShowPassword] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const countryDropdownRef = useRef<HTMLDivElement>(null);
    const countryButtonRef = useRef<HTMLButtonElement>(null);

    // Sync mode with initialMode when it changes
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    // Filter countries based on search term
    const filteredCountries = sortedCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm)
    );

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current && 
                !modalRef.current.contains(event.target as Node) &&
                backdropRef.current &&
                backdropRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close modal on Escape key press
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    // Close country dropdown when clicking outside
    useEffect(() => {
        const handleClickOutsideDropdown = (event: MouseEvent) => {
            if (
                showCountryDropdown &&
                countryDropdownRef.current &&
                !countryDropdownRef.current.contains(event.target as Node) &&
                countryButtonRef.current &&
                !countryButtonRef.current.contains(event.target as Node)
            ) {
                setShowCountryDropdown(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutsideDropdown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        };
    }, [showCountryDropdown]);

    // Clear search when dropdown closes
    useEffect(() => {
        if (!showCountryDropdown) {
            setSearchTerm('');
        }
    }, [showCountryDropdown]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'login') {
            console.log({ email, password });
        } else {
            console.log({ email, fullName, mobileNumber: countryCode + mobileNumber, password });
        }
    };

    const selectedCountry = sortedCountries.find(c => c.code === countryCode) || sortedCountries[0];

    return (
        <div 
            ref={backdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-[505.9px] max-h-[90vh] overflow-y-auto"
            >
                {/* Header with Purple Background */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition z-10"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src='/images/Payment Graphic.jpg.jpeg'
                        alt='auth image error'
                        className='object-cover h-[266.2px] w-[505.9px]'
                    />
                </div>

                {/* Form Content */}
                <div className="p-8">
                    {mode === 'login' ? (
                        <>
                            <h2 className="text-2xl font-bold text-center mb-2">{t.enterEmailPassword}</h2>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                {t.noAccountYet}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Input */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder={t.email}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-[42px] px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder={t.password}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-[42px] px-3 pr-10 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-xs text-gray-600 hover:text-purple-600 mt-1"
                                    >
                                        {t.lostPassword}
                                    </button>
                                </div>

                                {/* Sign in with Google */}
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                    <span>{t.signInWith}</span>
                                    <button type="button" className="flex items-center justify-center">
                                        <FcGoogle size={24} />
                                    </button>
                                </div>

                                {/* Create Account Link */}
                                <div className="text-center text-sm">
                                    <span className="text-gray-600">{t.newHere} </span>
                                    <button
                                        type="button"
                                        onClick={() => setMode('signup')}
                                        className="text-blue-500 hover:underline font-medium"
                                    >
                                        {t.createAccount}
                                    </button>
                                </div>

                                {/* Continue Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-medium"
                                >
                                    {t.continueBtn}
                                </button>

                                {/* Terms */}
                                <div className="text-center text-xs text-gray-500">
                                    {t.byContinuing}{' '}
                                    <Link href="/terms" className="text-gray-700 hover:underline">
                                        {t.termsOfService}
                                    </Link>
                                    {' '}
                                    <Link href="/privacy" className="text-gray-700 hover:underline">
                                        {t.privacyPolicy}
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-center mb-2">
                                {t.enterMobileEmail}
                            </h2>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                {t.registerAccount}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Input */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder={t.email}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-[42px] px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                {/* Mobile Number with Country Code */}
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <button
                                            ref={countryButtonRef}
                                            type="button"
                                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                            className="h-[42px] px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2 bg-white min-w-[100px]"
                                        >
                                            <img 
                                                src={selectedCountry.flag} 
                                                alt={selectedCountry.name}
                                                className="w-5 h-3.5 object-cover rounded"
                                            />
                                            <span>{selectedCountry.code}</span>
                                        </button>

                                        {showCountryDropdown && (
                                            <div 
                                                ref={countryDropdownRef}
                                                className="absolute top-full left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-10"
                                            >
                                                {/* Search Input */}
                                                <div className="sticky top-0 bg-white p-2 border-b">
                                                    <input
                                                        type="text"
                                                        placeholder={t.searchCountry}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                        autoFocus
                                                    />
                                                </div>

                                                {/* Country List */}
                                                <div className="max-h-64 overflow-y-auto">
                                                    {filteredCountries.length > 0 ? (
                                                        filteredCountries.map((country) => (
                                                            <button
                                                                key={`${country.isoCode}-${country.code}`}
                                                                type="button"
                                                                onClick={() => {
                                                                    setCountryCode(country.code);
                                                                    setShowCountryDropdown(false);
                                                                    setSearchTerm('');
                                                                }}
                                                                className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm ${
                                                                    country.code === countryCode ? 'bg-purple-50' : ''
                                                                }`}
                                                            >
                                                                <img 
                                                                    src={country.flag} 
                                                                    alt={country.name}
                                                                    className="w-6 h-4 object-cover rounded"
                                                                />
                                                                <span className="flex-1 text-left">{country.name}</span>
                                                                <span className="text-gray-600 font-medium">{country.code}</span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                            {t.noCountriesFound}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="tel"
                                        placeholder={t.mobileNumber}
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                        className="flex-1 h-[42px] px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                        maxLength={15}
                                    />
                                </div>

                                {/* Full Name Input */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t.fullName}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full h-[42px] px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t.password}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-[42px] px-3 pr-10 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Sign in with Google */}
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                    <span>{t.signInWith}</span>
                                    <button type="button" className="flex items-center justify-center">
                                        <FcGoogle size={24} />
                                    </button>
                                </div>

                                {/* Login Link */}
                                <div className="text-center text-sm">
                                    <span className="text-gray-600">{t.alreadyHaveAccount} </span>
                                    <button
                                        type="button"
                                        onClick={() => setMode('login')}
                                        className="text-blue-500 hover:underline font-medium"
                                    >
                                        {t.loginHere}
                                    </button>
                                </div>

                                {/* Verification Code Input */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t.verificationCode}
                                        className="w-full h-[42px] px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        maxLength={6}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t.verificationCodeSent}</p>
                                </div>

                                {/* Continue Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-medium"
                                >
                                    {t.continueBtn}
                                </button>

                                {/* Terms */}
                                <div className="text-center text-xs text-gray-500">
                                    {t.byContinuing}{' '}
                                    <Link href="/terms" className="text-gray-700 hover:underline">
                                        {t.termsOfService}
                                    </Link>
                                    {' '}
                                    <Link href="/privacy" className="text-gray-700 hover:underline">
                                        {t.privacyPolicy}
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}