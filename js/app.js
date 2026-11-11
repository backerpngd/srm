'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const PR=['fajr','dhuhr','asr','maghrib','isha'],K='srm.v1',MAXN=24;
/* Happiness (Track, one answer per day): well | moderate | none.
   fromEmo turns an old Emotions answer (older data or backup files) into a level. Nothing writes Emotions any more. */
const HAP=['well','moderate','none'];
const fromEmo=a=>!Array.isArray(a)||!a.length?null:a.includes('happy')?(a.some(x=>x!=='happy')?'moderate':'well'):'none';
// TIME WINDOW: true = Track opens only 9:00 PM – 11:59 PM (release); false = open all day (testing build).
const ENFORCE_TIME_WINDOW=true;
// Quran 29:45 (portion supplied by the owner). Replace translations with your trusted source if needed.
const VERSE={ar:'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
en:'Indeed, prayer prohibits immorality and wrongdoing.',
ml:'തീർച്ചയായും നമസ്കാരം നീചവൃത്തിയിൽ നിന്നും നിഷിദ്ധകർമ്മത്തിൽ നിന്നും തടയുന്നു.'};
/* Track: honesty reminder before the questions (17:14; Malayalam meaning chosen by the owner) */
const HV={ref:'17:14',ar:'اقْرَأْ كِتَابَكَ كَفَىٰ بِنَفْسِكَ الْيَوْمَ عَلَيْكَ حَسِيبًا',
 ml:'നിന്റെ ഗ്രന്ഥം വായിക്കുക. ഇന്ന് നിന്നെ വിചാരണ ചെയ്യാൻ നീ തന്നെ മതി.',en:'Read your record. Sufficient is yourself against you this Day as accountant.'};
/* Insights: one verse per card (Malayalam meanings supplied by the owner; 29:45 is the same text as on the Track card) */
const IVR={cons:{ref:'4:103',ar:'…إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
 ml:'തീർച്ചയായും നമസ്കാരം സത്യവിശ്വാസികൾക്ക് സമയം നിർണയിക്കപ്പെട്ട ഒരു നിർബന്ധബാധ്യതയാകുന്നു.',en:'Indeed, prayer has been decreed upon the believers at fixed times.'},
mot:{ref:'98:5',ar:'وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ…',
 ml:'കീഴ്വണക്കം അല്ലാഹുവിന് മാത്രമാക്കി, ഋജുമാനസരായി അവനെ ആരാധിക്കാനും നമസ്കാരം നിലനിർത്താനുമല്ലാതെ അവരോട് കൽപ്പിക്കപ്പെട്ടിട്ടില്ല…',en:'They were commanded only to worship Allah, sincere in faith to Him, upright, and to establish prayer…'},
man:{ref:'23:1–2',ar:'قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ',
 ml:'തീർച്ചയായും വിശ്വാസികൾ വിജയിച്ചിരിക്കുന്നു; തങ്ങളുടെ നമസ്കാരത്തിൽ ഭക്തിയുള്ളവരായ…',en:'Successful indeed are the believers, those who are humble in their prayer.'},
imp:{ref:'29:45',ar:VERSE.ar,ml:VERSE.ml,en:VERSE.en},
hap:{ref:'13:28',ar:'…أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
 ml:'അറിയുക, അല്ലാഹുവിനെക്കുറിച്ചുള്ള സ്മരണ കൊണ്ടാണ് ഹൃദയങ്ങൾ ശാന്തമാകുന്നത്.',en:'Truly, in the remembrance of Allah do hearts find rest.'}};
const L={en:{dDelR:'Delete data',nDays:'{n} days',honM:'Answer every question honestly, keeping the final reckoning in mind. At that reckoning, each person will be told:',impPD:'{d} saved days',wlc:'Welcome',wlcSub:'Create your profile to start.',strk:'Streak',pdfRange:'Choose dates between {a} and {b}.',pdfAllRest:'All selected days were exempt days.',pdfLast:'Last 31 days',pdfPick:'Choose dates',pdfMax:'Up to 31 days',pdfMaxE:'You can choose up to 31 days.',rMap:'Day by day',rC:'Performed, no shortfall',rS:'Performed, with shortfall',rX:'Missed',rU:'Not recorded',rR:'Exempt',cRx:' (excluding {x} exempt prayers)',iRecX:'{x} days recorded',o_mod:'the effect was moderate on {x} days',o_poor:'weak on {x} days',o_na:'could not be assessed on {x} days because prayers were missed or the day was not recorded',h_a:'On {x} days your prayer was complete and you felt happy. This is real happiness.',h_b:'On {x} days your prayer was complete, yet happiness was low. Find contentment in the good you did.',h_c:'On {x} days you felt happy despite shortfalls in prayer. Improve your prayer to earn real happiness.',h_d:'On {x} days there were shortfalls in prayer and happiness was low too. Improve your prayer and real happiness will follow.',iNone:'No prayer was performed on these days, so motive, manner and life impact cannot be assessed.',rTitle:'Exempt period',rStart:'Exemption started',rStartQ:'From which prayer did your exemption start today?',rEndQ:'After your exemption, from which prayer do you resume today?',rDay:'Day {n} · since {d}',rAsk1:'Has your exemption ended?',rAsk2:'Is your exemption still continuing?',rEnd:'Ended',rCont:'Continuing',rCancel:'Undo',rFromT:'Exempt from {p} today.',rEndT:'Exemption ended. Prayers resume from {p} today.',rEndT0:'Exemption ended.',rNote:'Nothing to record during exemption. These days are left out of all counts.',rToday:'Exempt day',iBaseA:'Based on {e} days',iRestX:'{x} exempt days',iUnX:'{x} days not recorded',iFirst:'Save today’s entry to start the analysis.',iAllRest:'All of the last {n} days were exempt days. The analysis continues after your exemption.',iSecA:'Prayer',iSecB:'Prayer in life',ia_cons:'Consistency',ia_mot:'Motive',ia_man:'Manner',c1_A:'Well done — you performed all {t} prayers{rx} across {n} days. Keep this steadiness in prayer and in your other duties in life.',c1_B:'{m} of {t} prayers{rx} were missed ({l}). Every prayer is an obligation that must be fulfilled.',m1_A:'Well done — all {p} prayers you performed were offered with the purpose of life in mind. Carry out your other duties in life with purpose too.',m1_B:'{w} of the {p} prayers you performed were not offered with the purpose of life in mind. A pure intention is essential to a complete prayer.',q1_A:'Well done — all {p} prayers you performed were on time and in the right way. Try to carry out your other duties in life with full attention too.',q1_B:'{w} of the {p} prayers you performed were not on time or not in the right way. Time and the right way both matter in prayer — give care to both.',o1_A:'Well done — on all {n} days your prayer strongly kept you away from immorality and wrongdoing.',o1_B:'Over {n} days, {l}. Prayer is meaningful only when it keeps you away from immorality and wrongdoing.',rgPr:'Prayer',rgPr2:'Performed',rgMo:'Motive',rgMo2:'Purpose of life',rgMa:'Manner',rgMa2:'Right way',noHap:'Not recorded',pHap:'Happiness',hapQ:'When you think about today, how happy do you feel?',hap_well:'Very happy',hap_moderate:'Somewhat happy',hap_none:'Not happy',hs_well:'Very',hs_moderate:'Somewhat',hs_none:'Not',
pdfT:'PDF summary',pdfHint:'In the print window, choose “Save as PDF”.',pdfFrom:'From',pdfTo:'To',pdfGo:'Create PDF',pdfErr:'The “From” date must not be after the “To” date.',pdfNone:'No days tracked yet.',rpTitle:'Prayer summary',rpName:'Name',rpPeriod:'Period',rpMade:'Created',
dm:'Data management',dDel:'Delete data',dDelS:'Remove all saved days of this profile',impPickT:'Choose a profile',impPickS:'This file has more than one profile. Whose saved days should be added to {n}?',okB:'OK',expT:'Export data',expS:'Save a backup file of this profile',expDone:'Backup file saved.',impT:'Import data',impS:'Add saved days from a backup file',impBadT:'Cannot import',impBad:'This file is not a Self Regulation Mastery backup.',impQT:'Import this backup?',impQ:'Saved days in the file: {d} ({a} – {b}). They will be added to {n}. Your current data stays. If a day is in both, the newer save is kept.',impB:'Import',impDone:'Imported. New days: {d} · Updated days: {u}',impSkip:'Damaged days skipped: {s}.',
insights:'Insights',s_insights:'Insight into your prayers.',
iNote:'This is only a reflection of your own entries.',
m_habit:'Out of habit',m_pressure:'Pressure from others',m_purpose:'Purpose of life',
guide:'How to use',gBack:'Back',gNext:'Next',gDone:'Got it',gStep:'Step {n} of {t}',g1h:'Profile',g1p:'First, create a profile. Each person needs a separate profile.',g2h:'Time',g2p:'You can track only from 9 PM to 11:59 PM. Record each day on the same day; it can’t be added later.',g3h:'Answers',g3p:'Answer honestly for each prayer: did you pray, why, and was it on time and in the right way.',g4h:'Impact & happiness',g4p:'Life impact is asked only when every prayer is done. Then choose today’s happiness.',g5h:'Save',g5p:'Once saved, the day is locked and can’t be changed.',g6h:'Exemption (women)',g6p:'Mark on Track when your exemption starts and ends. Exempt days are not counted.',g7h:'Results & backup',g7p:'See your growth in Progress and Insights, and download a PDF. Before changing phones, take a backup from Profile.',kicker:'Daily Prayer Tracker',tagline:'Record, evaluate and improve your daily prayers.',login:'Log in',loginSub:'Choose a profile to continue.',createProfile:'Create profile',pname:'Profile name',gender:'Gender',choose:'Select gender',male:'Male',female:'Female',create:'Create',
eName:'Enter a name.',eGender:'Select a gender.',eDup:'A profile with this name already exists.',
track:'Track',progress:'Progress',profile:'Profile',s_track:'Record today’s prayers.',s_progress:'Analyze your consistency and growth.',s_profile:'Manage your profile.',
locked:'Tracking: 9 PM – 11:59 PM only.',
p_fajr:'Fajr',p_dhuhr:'Dhuhr',p_asr:'Asr',p_maghrib:'Maghrib',p_isha:'Isha',didPray:'Did you pray?',sLocked:'Locked',sPick:'Select one',hAns:'Answer every question to save.',grpAcc:'Account',doneT:'Today is done',doneS:'See you tomorrow.',doneAt:'Saved at {t}',thisWk:'Last 7 days',prevWk:'Previous 7 days',nextWk:'Next 7 days',pToday:'Today',pDaily:'Daily prayers',streakL:'Streak',daysL:'Days recorded',restL:'Exempt days',goTrack:'Go to Track',restShort:'Exempt',sNo:'Not prayed',sDone:'Completed',sLeft:'{n} more to answer',yes:'Yes',no:'No',notQ:'No',k_motive:'Motive',k_manner:'Manner',motive:'Why did you pray?',manner:'On time and in the right way',
impact:'Life impact',impactQ:'How strong was your prayer’s effect today in keeping you away from immorality and wrongdoing?',better:'Strong',average:'Moderate',poor:'Weak',
unlock:'Unlocks when you answer Yes for every prayer.',
save:'Save today',saveT:'Save today?',saveM:'Once saved, it is locked and cannot be changed.',cancel:'Cancel',savedToast:'Saved',
none:'Nothing recorded for today yet.',exCard:'Marked as an exempt day',
cons:'Consistency',nr:'Not recorded',pending:'Pending',
noImp:'Not assessed',
joined:'Joined',lang:'Language',theme:'Theme',tLight:'Light',tDark:'Dark',switchP:'Switch profile',editN:'Edit name',del:'Delete profile',
editQ:'Are you sure you want to change your profile name?',saveName:'Save name',
clrQ:'Are you sure you want to delete all saved days of this profile? This cannot be undone.',clrB:'Delete all data',
delQ:'Are you sure you want to permanently delete this profile and all its data? This cannot be undone.',delB:'Delete permanently',
done:'Done',storeErr:'Could not save. Storage may be full.'},
ml:{dDelR:'ഡിലീറ്റ് ചെയ്യുക',nDays:'{n} ദിവസം',honM:'ഓരോ ഉത്തരവും പരലോക വിചാരണ മനസ്സിൽ കണ്ട് സത്യസന്ധമായി രേഖപ്പെടുത്തുക. അവിടെ ഓരോരുത്തരോടും പറയപ്പെടും:',impPD:'സേവ് ചെയ്ത ദിവസം: {d}',wlc:'സ്വാഗതം',wlcSub:'തുടങ്ങാൻ നിങ്ങളുടെ പ്രൊഫൈൽ സൃഷ്ടിക്കുക.',strk:'തുടർച്ച',pdfRange:'{a} മുതൽ {b} വരെയുള്ള തീയതികൾ തിരഞ്ഞെടുക്കുക.',pdfAllRest:'തിരഞ്ഞെടുത്ത ദിവസങ്ങളെല്ലാം ഒഴിവ് ദിവസങ്ങളാണ്.',pdfLast:'അവസാന 31 ദിവസം',pdfPick:'തീയതി നൽകുക',pdfMax:'പരമാവധി 31 ദിവസം',pdfMaxE:'പരമാവധി 31 ദിവസം തിരഞ്ഞെടുക്കാം.',rMap:'ദിവസം തിരിച്ച്',rC:'കുറവില്ലാതെ നിർവഹിച്ചു',rS:'കുറവോടെ നിർവഹിച്ചു',rX:'വിട്ടുപോയി',rU:'രേഖപ്പെടുത്തിയില്ല',rR:'ഒഴിവ്',cRx:' ({x} നമസ്കാരം ഒഴിവ്)',iRecX:'{x} ദിവസം രേഖപ്പെടുത്തി',o_mod:'{x} ദിവസം സ്വാധീനം മിതം',o_poor:'{x} ദിവസം ദുർബലം',o_na:'{x} ദിവസം നമസ്കാരം വിട്ടുപോയതിനാലോ രേഖപ്പെടുത്താത്തതിനാലോ സ്വാധീനം വിലയിരുത്താൻ കഴിയില്ല',h_a:'{x} ദിവസം നമസ്കാരം പൂർണ്ണമായിരുന്നു, നല്ല സന്തോഷവും തോന്നി. ഇതാണ് യഥാർത്ഥ സന്തോഷം.',h_b:'{x} ദിവസം നമസ്കാരം പൂർണ്ണമായിട്ടും സന്തോഷം കുറവായിരുന്നു. നിങ്ങൾ ചെയ്ത നന്മയിൽ സംതൃപ്തി കണ്ടെത്തുക.',h_c:'{x} ദിവസം നമസ്കാരത്തിൽ കുറവുണ്ടായിട്ടും നല്ല സന്തോഷം തോന്നി. യഥാർത്ഥ സന്തോഷത്തിന് അർഹത നേടാൻ നമസ്കാരം മെച്ചപ്പെടുത്തുക.',h_d:'{x} ദിവസം നമസ്കാരത്തിൽ കുറവുണ്ടായി, സന്തോഷവും കുറവായിരുന്നു. നമസ്കാരം മെച്ചപ്പെടുത്തിയാൽ യഥാർത്ഥ സന്തോഷം ലഭിക്കും.',iNone:'ഈ ദിവസങ്ങളിൽ ഒരു നമസ്കാരവും നിർവഹിക്കാത്തതിനാൽ പ്രേരണ, രീതി, സ്വാധീനം എന്നിവ വിലയിരുത്താൻ കഴിയില്ല.',rTitle:'ഒഴിവ് കാലം',rStart:'ഒഴിവ് തുടങ്ങി',rStartQ:'ഇന്ന് ഏത് നമസ്കാരം മുതലാണ് ഒഴിവ് തുടങ്ങിയത്?',rEndQ:'ഒഴിവ് കഴിഞ്ഞ് ഇന്ന് ഏത് നമസ്കാരം മുതൽ തുടങ്ങും?',rDay:'{n}-ാം ദിവസം · {d} മുതൽ',rAsk1:'ഒഴിവ് തീർന്നോ?',rAsk2:'ഒഴിവ് ഇപ്പോഴും തുടരുന്നുണ്ടോ?',rEnd:'തീർന്നു',rCont:'തുടരുന്നു',rCancel:'പഴയപടിയാക്കുക',rFromT:'ഇന്ന് {p} മുതൽ ഒഴിവ്.',rEndT:'ഒഴിവ് തീർന്നു. ഇന്ന് {p} മുതൽ നമസ്കാരം തുടരും.',rEndT0:'ഒഴിവ് തീർന്നു.',rNote:'ഒഴിവ് കാലത്ത് ഒന്നും രേഖപ്പെടുത്തേണ്ടതില്ല. ഈ ദിവസങ്ങൾ ഒരു കണക്കിലും ഉൾപ്പെടുത്തില്ല.',rToday:'ഒഴിവ് ദിവസം',iBaseA:'{e} ദിവസം അടിസ്ഥാനമാക്കി',iRestX:'{x} ഒഴിവ് ദിവസം',iUnX:'{x} ദിവസം രേഖപ്പെടുത്തിയില്ല',iFirst:'ഇന്നത്തെ ദിവസം സേവ് ചെയ്താൽ വിശകലനം തുടങ്ങും.',iAllRest:'കഴിഞ്ഞ {n} ദിവസവും ഒഴിവ് ദിവസങ്ങളായിരുന്നു. ഒഴിവ് കഴിഞ്ഞ് വിശകലനം തുടരും.',iSecA:'നമസ്കാരം',iSecB:'നമസ്കാരം ജീവിതത്തിൽ',ia_cons:'സ്ഥിരത',ia_mot:'പ്രേരണ',ia_man:'രീതി',c1_A:'അഭിനന്ദനങ്ങൾ! {n} ദിവസത്തെ {t} നമസ്കാരവും{rx} നിങ്ങൾ നിർവഹിച്ചു. ഈ സ്ഥിരത നമസ്കാരത്തിലും ജീവിതത്തിലെ മറ്റ് ഉത്തരവാദിത്തങ്ങളിലും നിലനിർത്തുക.',c1_B:'{t} നമസ്കാരത്തിൽ{rx} {m} നമസ്കാരം വിട്ടുപോയി ({l}). ഓരോ നമസ്കാരവും നിർബന്ധമായും നിർവഹിക്കേണ്ട ഉത്തരവാദിത്തമാണ്.',m1_A:'അഭിനന്ദനങ്ങൾ! നിർവഹിച്ച {p} നമസ്കാരവും ജീവിതലക്ഷ്യത്തോടെ ആയിരുന്നു. ജീവിതത്തിലെ മറ്റ് ഉത്തരവാദിത്തങ്ങളും ലക്ഷ്യബോധത്തോടെ നിർവഹിക്കുക.',m1_B:'നിർവഹിച്ച {p} നമസ്കാരത്തിൽ {w} എണ്ണം ജീവിതലക്ഷ്യത്തോടെ ആയിരുന്നില്ല. ഉദ്ദേശ്യശുദ്ധി നമസ്കാരത്തിന്റെ പൂർണ്ണതയ്ക്ക് അനിവാര്യമാണ്.',q1_A:'അഭിനന്ദനങ്ങൾ! നിർവഹിച്ച {p} നമസ്കാരവും കൃത്യസമയത്തും ശരിയായ രീതിയിലും ആയിരുന്നു. ജീവിതത്തിലെ മറ്റ് ഉത്തരവാദിത്തങ്ങളും പൂർണ്ണ ശ്രദ്ധയോടെ നിർവഹിക്കാൻ ശ്രമിക്കുക.',q1_B:'നിർവഹിച്ച {p} നമസ്കാരത്തിൽ {w} എണ്ണം കൃത്യസമയത്തും ശരിയായ രീതിയിലും ആയിരുന്നില്ല. കൃത്യസമയവും ശരിയായ രീതിയും നമസ്കാരത്തിൽ പ്രധാനമാണ്, രണ്ടിനും ശ്രദ്ധ നൽകുക.',o1_A:'അഭിനന്ദനങ്ങൾ! {n} ദിവസവും നമസ്കാരം നിങ്ങളെ നീചവൃത്തിയിൽ നിന്നും നിഷിദ്ധകർമ്മത്തിൽ നിന്നും ശക്തമായി തടഞ്ഞു.',o1_B:'{n} ദിവസത്തിൽ, {l}. നീചവൃത്തിയിൽ നിന്നും നിഷിദ്ധകർമ്മത്തിൽ നിന്നും തടയുമ്പോൾ മാത്രമാണ് നമസ്കാരം അർത്ഥവത്താകുന്നത്.',rgPr:'നമസ്കാരം',rgPr2:'നിർവഹിച്ചത്',rgMo:'പ്രേരണ',rgMo2:'ജീവിതലക്ഷ്യം',rgMa:'രീതി',rgMa2:'ശരിയാംവിധം',noHap:'രേഖപ്പെടുത്തിയില്ല',pHap:'സന്തോഷം',hapQ:'ഇന്നത്തെ ദിവസത്തെക്കുറിച്ച് ചിന്തിക്കുമ്പോൾ നിങ്ങൾക്ക് എത്രമാത്രം സന്തോഷം തോന്നുന്നു?',hap_well:'നല്ല സന്തോഷം',hap_moderate:'കുറച്ച് സന്തോഷം',hap_none:'സന്തോഷമില്ല',hs_well:'നല്ലത്',hs_moderate:'കുറച്ച്',hs_none:'ഇല്ല',
pdfT:'PDF സംഗ്രഹം',pdfHint:'പ്രിന്റ് വിൻഡോയിൽ “Save as PDF” തിരഞ്ഞെടുക്കുക.',pdfFrom:'മുതൽ',pdfTo:'വരെ',pdfGo:'PDF ഉണ്ടാക്കുക',pdfErr:'“മുതൽ” തീയതി “വരെ” തീയതിക്ക് ശേഷമാകരുത്.',pdfNone:'ഇതുവരെ രേഖപ്പെടുത്തിയ ദിവസങ്ങളില്ല.',rpTitle:'നമസ്കാര സംഗ്രഹം',rpName:'പേര്',rpPeriod:'കാലയളവ്',rpMade:'തയ്യാറാക്കിയത്',
dm:'ഡാറ്റ മാനേജ്മെന്റ്',dDel:'ഡാറ്റ ഡിലീറ്റ് ചെയ്യുക',dDelS:'ഈ പ്രൊഫൈലിൽ സേവ് ചെയ്ത എല്ലാ ദിവസങ്ങളും നീക്കുക',impPickT:'ഒരു പ്രൊഫൈൽ തിരഞ്ഞെടുക്കുക',impPickS:'ഈ ഫയലിൽ ഒന്നിലധികം പ്രൊഫൈലുണ്ട്. ആരുടെ സേവ് ചെയ്ത ദിവസങ്ങളാണ് {n} എന്ന പ്രൊഫൈലിലേക്ക് ചേർക്കേണ്ടത്?',okB:'ശരി',expT:'എക്സ്പോർട്ട് ചെയ്യുക',expS:'ഈ പ്രൊഫൈലിന്റെ ബാക്കപ്പ് ഫയൽ സേവ് ചെയ്യുക',expDone:'ബാക്കപ്പ് ഫയൽ സേവ് ചെയ്തു.',impT:'ഇമ്പോർട്ട് ചെയ്യുക',impS:'ബാക്കപ്പ് ഫയലിൽ നിന്ന് സേവ് ചെയ്ത ദിവസങ്ങൾ ചേർക്കുക',impBadT:'ഇമ്പോർട്ട് ചെയ്യാൻ കഴിയില്ല',impBad:'ഇത് Self Regulation Mastery-യുടെ ബാക്കപ്പ് ഫയൽ അല്ല.',impQT:'ഈ ബാക്കപ്പ് ഇമ്പോർട്ട് ചെയ്യണോ?',impQ:'ഫയലിൽ സേവ് ചെയ്ത ദിവസം: {d} ({a} – {b}). ഇവ {n} എന്ന പ്രൊഫൈലിലേക്ക് ചേർക്കും. ഇപ്പോഴത്തെ ഡാറ്റ നിലനിൽക്കും. ഒരേ ദിവസം രണ്ടിലും ഉണ്ടെങ്കിൽ പുതിയതായി സേവ് ചെയ്തത് നിലനിർത്തും.',impB:'ഇമ്പോർട്ട് ചെയ്യുക',impDone:'ഇമ്പോർട്ട് ചെയ്തു. പുതിയ ദിവസം: {d} · പുതുക്കിയ ദിവസം: {u}',impSkip:'കേടായതിനാൽ ഒഴിവാക്കിയ ദിവസം: {s}.',
insights:'ഉൾക്കാഴ്ച',s_insights:'നിങ്ങളുടെ നമസ്കാരത്തെക്കുറിച്ചുള്ള ഉൾക്കാഴ്ച.',
iNote:'ഇത് നിങ്ങളുടെ സ്വന്തം രേഖകളിൽ നിന്നുള്ള പ്രതിഫലനം മാത്രമാണ്.',
m_habit:'കേവല ശീലം',m_pressure:'മറ്റുള്ളവരുടെ സമ്മർദ്ദം',m_purpose:'ജീവിതലക്ഷ്യം',
guide:'ഉപയോഗക്രമം',gBack:'മുമ്പത്തേത്',gNext:'അടുത്തത്',gDone:'മനസ്സിലായി',gStep:'{t}-ൽ {n}-ാം പടി',g1h:'പ്രൊഫൈൽ',g1p:'ആദ്യം പ്രൊഫൈൽ സൃഷ്ടിക്കുക. ഓരോ വ്യക്തിക്കും വേറെ പ്രൊഫൈൽ.',g2h:'സമയം',g2p:'രാത്രി 9 മുതൽ 11:59 വരെ മാത്രം ട്രാക്ക് ചെയ്യാം. അന്നത്തേത് അന്നുതന്നെ ചെയ്യുക, പിന്നീട് ചേർക്കാനാവില്ല.',g3h:'ഉത്തരങ്ങൾ',g3p:'ഓരോ നമസ്കാരത്തിനും സത്യസന്ധമായി ഉത്തരം നൽകുക: നമസ്കരിച്ചോ, എന്തിനുവേണ്ടി, ശരിയായ സമയത്തും രീതിയിലും ആയിരുന്നോ.',g4h:'സ്വാധീനവും സന്തോഷവും',g4p:'എല്ലാ നമസ്കാരവും നിർവഹിച്ചാൽ മാത്രം ജീവിതത്തിലെ സ്വാധീനം ചോദിക്കും. അതിന് ശേഷം ഇന്നത്തെ സന്തോഷം തിരഞ്ഞെടുക്കുക.',g5h:'സേവ്',g5p:'സേവ് ചെയ്താൽ ലോക്ക് ആകും, പിന്നെ മാറ്റാനാവില്ല.',g6h:'ഒഴിവ് (സ്ത്രീകൾക്ക്)',g6p:'ഒഴിവ് തുടങ്ങുമ്പോഴും തീരുമ്പോഴും ട്രാക്കിൽ രേഖപ്പെടുത്തുക. ഒഴിവ് ദിവസങ്ങൾ കണക്കിൽ വരില്ല.',g7h:'ഫലവും ബാക്കപ്പും',g7p:'പുരോഗതിയിലും ഉൾക്കാഴ്ചയിലും നിങ്ങളുടെ വളർച്ച കാണാം, PDF എടുക്കാം. ഫോൺ മാറുന്നതിന് മുമ്പ് പ്രൊഫൈലിൽ നിന്ന് ബാക്കപ്പ് എടുക്കുക.',kicker:'ദൈനംദിന നമസ്കാര ട്രാക്കർ',tagline:'നിങ്ങളുടെ ദൈനംദിന നമസ്കാരങ്ങൾ രേഖപ്പെടുത്തുക, വിലയിരുത്തുക, മെച്ചപ്പെടുത്തുക.',login:'ലോഗിൻ',loginSub:'തുടരാൻ ഒരു പ്രൊഫൈൽ തിരഞ്ഞെടുക്കുക.',createProfile:'പ്രൊഫൈൽ സൃഷ്ടിക്കുക',pname:'പ്രൊഫൈൽ പേര്',gender:'ലിംഗം',choose:'ലിംഗം തിരഞ്ഞെടുക്കുക',male:'പുരുഷൻ',female:'സ്ത്രീ',create:'സൃഷ്ടിക്കുക',
eName:'പേര് നൽകുക.',eGender:'ലിംഗം തിരഞ്ഞെടുക്കുക.',eDup:'ഈ പേരിൽ ഒരു പ്രൊഫൈൽ നിലവിലുണ്ട്.',
track:'ട്രാക്ക്',progress:'പുരോഗതി',profile:'പ്രൊഫൈൽ',s_track:'ഇന്നത്തെ നമസ്കാരങ്ങൾ രേഖപ്പെടുത്തുക.',s_progress:'നിങ്ങളുടെ സ്ഥിരതയും വളർച്ചയും വിശകലനം ചെയ്യുക.',s_profile:'നിങ്ങളുടെ പ്രൊഫൈൽ കൈകാര്യം ചെയ്യുക.',
locked:'ട്രാക്കിങ് രാത്രി 9 മുതൽ 11:59 വരെ മാത്രം.',
p_fajr:'സുബ്ഹ്',p_dhuhr:'ളുഹ്ർ',p_asr:'അസ്ർ',p_maghrib:'മഗ്രിബ്',p_isha:'ഇശാ',didPray:'നമസ്കരിച്ചോ?',sLocked:'ലോക്ക് ചെയ്തിരിക്കുന്നു',sPick:'ഒന്ന് തിരഞ്ഞെടുക്കുക',hAns:'സേവ് ചെയ്യാൻ എല്ലാ ചോദ്യത്തിനും ഉത്തരം നൽകുക.',grpAcc:'അക്കൗണ്ട്',doneT:'ഇന്നത്തേത് പൂർത്തിയായി',doneS:'നാളെ വീണ്ടും കാണാം.',doneAt:'സേവ് ചെയ്തത്: {t}',thisWk:'കഴിഞ്ഞ 7 ദിവസം',prevWk:'മുമ്പത്തെ 7 ദിവസം',nextWk:'അടുത്ത 7 ദിവസം',pToday:'ഇന്ന്',pDaily:'ദൈനംദിന നമസ്കാരം',streakL:'തുടർച്ച',daysL:'രേഖപ്പെടുത്തിയ ദിവസങ്ങൾ',restL:'ഒഴിവ് ദിവസങ്ങൾ',goTrack:'ട്രാക്കിലേക്ക് പോകുക',restShort:'ഒഴിവ്',sNo:'നമസ്കരിച്ചില്ല',sDone:'പൂർത്തിയായി',sLeft:'{n} ഉത്തരം ബാക്കി',yes:'അതെ',no:'ഇല്ല',notQ:'അല്ല',k_motive:'പ്രേരണ',k_manner:'രീതി',motive:'എന്തിനുവേണ്ടി നമസ്കരിച്ചു?',manner:'ശരിയായ സമയത്തും രീതിയിലും',
impact:'ജീവിതത്തിലെ സ്വാധീനം',impactQ:'നീചവൃത്തിയിൽ നിന്നും നിഷിദ്ധകർമ്മത്തിൽ നിന്നും നിങ്ങളെ തടയുന്നതിൽ ഇന്നത്തെ നമസ്കാരത്തിന്റെ സ്വാധീനം എങ്ങനെയായിരുന്നു?',better:'ശക്തം',average:'മിതം',poor:'ദുർബലം',
unlock:'എല്ലാ നമസ്കാരവും “അതെ” ആകുമ്പോൾ തുറക്കും.',
save:'ഇന്നത്തേത് സേവ് ചെയ്യുക',saveT:'ഇന്നത്തേത് സേവ് ചെയ്യണോ?',saveM:'സേവ് ചെയ്താൽ ലോക്ക് ആകും; പിന്നീട് മാറ്റാൻ കഴിയില്ല.',cancel:'വേണ്ട',savedToast:'സേവ് ചെയ്തു',
none:'ഇന്ന് ഇതുവരെ ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല.',exCard:'ഒഴിവ് ദിവസമായി രേഖപ്പെടുത്തി',
cons:'സ്ഥിരത',nr:'രേഖപ്പെടുത്തിയില്ല',pending:'ബാക്കിയുണ്ട്',
noImp:'വിലയിരുത്താനായില്ല',
joined:'ചേർന്നത്',lang:'ഭാഷ',theme:'തീം',tLight:'ലൈറ്റ്',tDark:'ഡാർക്ക്',switchP:'പ്രൊഫൈൽ മാറ്റുക',editN:'പേര് മാറ്റുക',del:'പ്രൊഫൈൽ ഡിലീറ്റ് ചെയ്യുക',
editQ:'പ്രൊഫൈൽ പേര് മാറ്റണമെന്ന് ഉറപ്പാണോ?',saveName:'പേര് സേവ് ചെയ്യുക',
clrQ:'ഈ പ്രൊഫൈലിൽ സേവ് ചെയ്ത എല്ലാ ദിവസങ്ങളും ഡിലീറ്റ് ചെയ്യണമെന്ന് ഉറപ്പാണോ? ഇത് തിരികെ ലഭിക്കില്ല.',clrB:'എല്ലാ ഡാറ്റയും ഡിലീറ്റ് ചെയ്യുക',
delQ:'ഈ പ്രൊഫൈലും അതിലെ എല്ലാ ഡാറ്റയും ശാശ്വതമായി ഡിലീറ്റ് ചെയ്യണമെന്ന് ഉറപ്പാണോ? ഇത് തിരികെ ലഭിക്കില്ല.',delB:'ശാശ്വതമായി ഡിലീറ്റ് ചെയ്യുക',
done:'ശരി',storeErr:'സേവ് ചെയ്യാനായില്ല. സ്റ്റോറേജ് നിറഞ്ഞിരിക്കാം.'}};
const IC={track:'<path d="M20 6 9 17l-5-5"/><circle cx="12" cy="12" r="10"/>',progress:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',profile:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
spark:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16v4M17 18h4"/>',smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',cal:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',insights:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><path d="M12 17h.01"/>',sw:'<path d="M17 3l4 4-4 4M21 7H9M7 21l-4-4 4-4M3 17h12"/>',ed:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',tr:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',ul:'<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'};
const svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
const ch=(ic,title,right='')=>`<div class="ch"><span class="ti">${svg(ic)}</span><div class="pi"><div class="pt">${title}</div></div>${right}</div>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fresh=()=>({schemaVersion:3,settings:{lang:'en'},profiles:{},trackingData:{},drafts:{}});
// schemaVersion lets future releases migrate old data safely (see migrate()).
function migrate(d){d.settings=d.settings||{lang:'en'};d.profiles=d.profiles||{};d.trackingData=d.trackingData||{};d.drafts=d.drafts||{};
/* v2: Motive was Yes/No, now habit | pressure | purpose. Saved Yes -> purpose, saved No -> unknown (we can't guess why).
   An unsaved draft's No is cleared so the user simply answers again. */
if((d.schemaVersion||1)<2){const fix=(p,dr)=>{if(p)PR.forEach(k=>{const x=p[k];if(x&&typeof x.motive==='boolean')x.motive=x.motive?'purpose':(dr?null:'unknown')})};
for(const a in d.trackingData)for(const k in d.trackingData[a]||{})fix((d.trackingData[a][k]||{}).prayers);
for(const a in d.drafts)for(const k in d.drafts[a]||{})fix((d.drafts[a][k]||{}).p,true)}
for(const a in d.trackingData)for(const k in d.trackingData[a]||{}){const e=d.trackingData[a][k];if(e&&!HAP.includes(e.happy))e.happy=fromEmo(e.emotions)}
for(const a in d.drafts)for(const k in d.drafts[a]||{}){const x=d.drafts[a][k];if(x&&!('hap' in x))x.hap=fromEmo(x.emo)}
d.schemaVersion=3;return d}
function load(){let d;try{d=JSON.parse(localStorage.getItem(K))}catch(e){return fresh()}if(!d||!d.schemaVersion)return fresh();
try{return migrate(d)}catch(e){console.error('migrate failed, data kept as is',e);return d}}
let DB=load();
const store=()=>{try{localStorage.setItem(K,JSON.stringify(DB))}catch(e){toast(t('storeErr'))}};
const mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):{matches:false};
function applyTheme(){const m=DB.settings.theme||'dark',d=m==='dark'||(m==='system'&&mq.matches);document.documentElement.dataset.theme=d?'dark':'light';const e=document.querySelector('meta[name=theme-color]');e&&e.setAttribute('content',d?'#0f172a':'#1e3a8a');thmUpdate()}
mq.addEventListener&&mq.addEventListener('change',applyTheme);
const THI={light:'sun',dark:'moon'},THL={light:'tLight',dark:'tDark'};
function thmUpdate(){const e=$('[data-theme-seg]');if(!e)return;const c=document.documentElement.dataset.theme||'light';e.innerHTML=`<div class="seg" role="group" aria-label="${t('theme')}">${['light','dark'].map(k=>`<button data-a="theme" data-v="${k}" class="${c===k?'on':''}" aria-pressed="${c===k}" title="${t(THL[k])}">${svg(THI[k])}<span class="sr">${t(THL[k])}</span></button>`).join('')}</div>`}
const S={pid:null,tab:'track'};
try{localStorage.removeItem('srm.dev')}catch(e){}   // tidy the old developer switch from earlier test builds
const t=k=>(L[DB.settings.lang]&&L[DB.settings.lang][k])||L.en[k]||k;
const dk=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); // local date, never UTC
const ini=n=>{n=n.trim();try{return[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(n)][0].segment.toLocaleUpperCase()}catch(e){return Array.from(n)[0].toUpperCase()}};
const P=()=>DB.profiles[S.pid],TD=()=>DB.trackingData[S.pid]||(DB.trackingData[S.pid]={});
const uid=()=>'p_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const dupe=(n,except)=>Object.values(DB.profiles).some(p=>p.id!==except&&p.name.trim().toLocaleLowerCase()===n.trim().toLocaleLowerCase());
let tm;function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('on'),2200)}
function lang(){thmUpdate();document.documentElement.lang=DB.settings.lang;$$('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));$$('[data-ip]').forEach(e=>e.placeholder=t(e.dataset.ip));
$$('[data-lang-seg]').forEach(e=>e.innerHTML=langSeg())}
const langSeg=()=>`<div class="seg" role="group" aria-label="${t('lang')}"><button data-a="lang" data-v="en" lang="en" class="${DB.settings.lang==='en'?'on':''}" aria-pressed="${DB.settings.lang==='en'}">English</button><button data-a="lang" data-v="ml" lang="ml" class="${DB.settings.lang==='ml'?'on':''}" aria-pressed="${DB.settings.lang==='ml'}">മലയാളം</button></div>`;
/* ---------- Welcome ---------- */
function plist(newId){$('#welcome').classList.toggle('noprof',!Object.keys(DB.profiles).length);$('#plist').innerHTML=Object.values(DB.profiles).sort((a,b)=>a.createdAt<b.createdAt?-1:1).map(p=>`<button class="pf${p.id===newId?' new':''}" data-a="login" data-id="${p.id}"><span class="av" aria-hidden="true">${esc(ini(p.name))}</span><span class="pn">${esc(p.name)}</span><span class="chev" aria-hidden="true">›</span></button>`).join('')}
function createProfile(){const n=$('#pname').value.trim().replace(/\s+/g,' '),g=$('#pgender').value,e=$('#cpErr');
e.textContent=!n?t('eName'):!g?t('eGender'):dupe(n)?t('eDup'):'';if(e.textContent)return;
const id=uid();DB.profiles[id]={id,name:n,gender:g,createdAt:new Date().toISOString()};DB.trackingData[id]={};store();
$('#pname').value='';$('#pgender').value='';$('#cpForm').classList.remove('open');plist(id)}
function showWelcome(){S.pid=null;$('#app').hidden=true;$('#welcome').hidden=false;closeSheet(true);plist();lang();$('#welcome').scrollTop=0}
function login(id){if(!DB.profiles[id])return;S.pid=id;S.tab='track';$('#welcome').hidden=true;$('#app').hidden=false;history.pushState({tab:'track'},'');go('track',false)}
/* ---------- Shell ---------- */
function go(tab,push=true){if(!S.pid)return;restSync();if(push&&tab!==S.tab)history.pushState({tab},'');S.tab=tab;
$('#hI').innerHTML=svg(tab);$('#hT').textContent=t(tab);$('#hS').textContent=t('s_'+tab);
$('#nav').innerHTML=['track','progress','insights','profile'].map(k=>`<button data-a="tab" data-v="${k}" class="${k===tab?'on':''}" aria-current="${k===tab}">${svg(k)}<span>${t(k)}</span></button>`).join('');
({track:vTrack,progress:vProgress,insights:vInsights,profile:vProfile})[tab]();$('#view').scrollTop=0}
const redraw=()=>{lang();if(S.pid)go(S.tab,false);else plist()};
/* ---------- Track ---------- */
const hour=()=>new Date().getHours(),isOpen=()=>!ENFORCE_TIME_WINDOW||hour()>=21;   // Track opens 9:00 PM – 11:59 PM
/* ---------- Rest period (female profiles) ----------
   Stored on the profile: rest:[{s:start day, sp:first rest prayer on the start day (0-4), e:end day or null while it lasts,
   ep:first prayer back on the end day (0-4), ack:day "still continuing" was answered}].
   A day inside a period has no prayers due; the start and end days can be part days (some prayers due, the rest marked rest:true when saved).
   Full rest days are written as rest entries (auto:true) so Progress, export and the PDF see them; they are re-made from the periods each time. */
const RP=()=>{const p=P();return Array.isArray(p.rest)?p.rest:(p.rest=[])};
function restOf(k){const out=new Set();
for(const r of (P().rest||[])){if(k<r.s||(r.e&&k>r.e)||(!r.e&&k>dk()))continue;let a=PR.slice(k===r.s?r.sp:0);if(r.e&&k===r.e)a=a.filter(x=>PR.indexOf(x)<r.ep);a.forEach(x=>out.add(x))}
return PR.filter(x=>out.has(x))}
const isRestDay=(k,e)=>!!(e&&e.isExempt)||restOf(k).length===5;
function restSync(){if(!S.pid||!P())return;const td=TD(),today=dk();let ch=false;
for(const k in td)if(td[k].auto&&restOf(k).length<5){delete td[k];ch=true}
for(const r of (P().rest||[])){const last=r.e||today;for(let d=new Date(r.s+'T00:00:00');dk(d)<=last;d.setDate(d.getDate()+1)){const k=dk(d);
 if(!td[k]&&restOf(k).length===5){td[k]={isExempt:true,prayers:null,impact:null,happy:null,savedAt:new Date().toISOString(),auto:true};ch=true}}}
if(ch)store()}
/* today: saved by the user (an auto rest entry is not a save) and its rest prayers */
const saved=()=>{const e=TD()[dk()];return !!e&&!e.auto};
const tR=()=>{const e=TD()[dk()];return e&&!e.auto&&e.prayers?PR.filter(k=>e.prayers[k].rest):restOf(dk())};
const due=()=>{const r=tR();return PR.filter(k=>!r.includes(k))};
const restNow=()=>{const today=dk();return RP().find(r=>r.s<=today&&(!r.e||r.e>=today))||null};
function restCard(){const today=dk(),r=restNow(),e=TD()[today],LK=saved();
const box=(body,btns)=>`<div class="glass card rcard" id="rcard"><div class="ch"><span class="ti">${svg('moon')}</span><div class="pi"><div class="pt">${t('rTitle')}</div>${body}</div></div>${btns?`<div class="rbtns">${btns}</div>`:''}</div>`;
const B=(a,txt,cls)=>`<button class="btn ${cls||'ghost'}" data-a="${a}"${LK?' disabled':''}>${txt}</button>`,pn=i=>t('p_'+PR[i]);
if(e&&e.isExempt&&!e.auto)return box(`<div class="ps">${t('rToday')}</div>`);
/* no rest now: one slim row, used once a month */
if(!r)return LK?'':`<div class="glass card rcard rmini" id="rcard"><span class="ti" aria-hidden="true">${svg('moon')}</span><div class="pt">${t('rTitle')}</div>${B('rstart',t('rStart'),'ghost')}</div>`;
if(r.e===today)return box(`<div class="ps">${r.ep?tf('rEndT',{p:pn(r.ep)}):t('rEndT0')}</div>`,LK?'':B('rundo',t('rCancel')));
if(r.s===today&&r.sp>0)return box(`<div class="ps">${tf('rFromT',{p:pn(r.sp)})}</div>`,LK?'':B('rundo',t('rCancel')));
const n=Math.round((d0(new Date())-new Date(r.s+'T00:00:00'))/864e5)+1,since=fD(r.s,{day:'numeric',month:'short'});
const head=`<div class="ps">${tf('rDay',{n,d:since})}</div><p class="rnote">${t('rNote')}</p>`;
if(r.s===today)return box(head,B('rundo',t('rCancel')));
const long=n>7&&r.ack!==today;
return box(head+`<p class="rq">${t(long?'rAsk2':'rAsk1')}</p>`,(long?B('rcont',t('rCont')):'')+B('rend',t('rEnd'),'pri'))}
const restSheet=(act,q)=>openSheet(`<h3>${t('rTitle')}</h3><p class="msg">${t(q)}</p><div class="rpick">${PR.map((k,i)=>`<button class="btn ghost" data-a="${act}" data-v="${i}">${t('p_'+k)}</button>`).join('')}</div><div class="btns"><button class="btn ghost" data-a="close">${t('cancel')}</button></div>`);
function draft(){const dr=DB.drafts[S.pid]||(DB.drafts[S.pid]={}),d=dk();for(const k in dr)if(k!==d)delete dr[k];
return dr[d]||(dr[d]={p:Object.fromEntries(PR.map(k=>[k,{prayed:null,motive:null,manner:null}])),impact:null,hap:null})}
/* Life Impact opens when every due prayer (rest prayers aside) was performed */
const unlocked=D=>{const q=due();return q.length>0&&q.every(k=>D.p[k].prayed===true)};
const answered=D=>due().every(k=>{const x=D.p[k];return x.prayed!==null&&(!x.prayed||(x.motive!==null&&x.manner!==null))});
function valid(D){if(!D.hap||!answered(D))return false;return unlocked(D)?!!D.impact:true}
const MOT=['habit','pressure','purpose'];
const mot=k=>`<div class="mot-w"><div class="seg full mot" role="group" aria-label="${t('k_motive')}">${MOT.map(m=>`<button data-a="ans" data-p="${k}" data-f="motive" data-v="${m}">${t('m_'+m)}</button>`).join('')}</div></div>`;
/* Yes/No; Malayalam "No" is ഇല്ല for an action (Did you pray?) and അല്ല for a quality (on time and in the right way) */
const yn=(a,attrs,no='no')=>`<div class="yn" role="group">${[1,0].map(v=>`<button data-a="${a}" ${attrs} data-v="${v}">${t(v?'yes':no)}</button>`).join('')}</div>`;
function vTrack(){restSync();const v=$('#view'),td=TD(),e=td[dk()];
const empty=(ic,m)=>`<div class="glass card empty"><div class="ic">${svg(ic)}</div><p>${m}</p></div>`;
if(!isOpen())return v.innerHTML=empty('lock',t('locked'));
const fem=P().gender==='female',LK=saved(),full=isRestDay(dk(),e),rs=tR();
const tm=LK&&e.savedAt?new Date(e.savedAt).toLocaleTimeString(DB.settings.lang==='ml'?'ml-IN':'en-IN',{hour:'numeric',minute:'2-digit'}).toUpperCase():'';
const banner=LK?`<div class="glass donebar" role="status"><span class="dchk" aria-hidden="true">✓</span><div class="pi"><div class="pt">${t('doneT')}</div><p>${t('doneS')}</p>${tm?`<span class="dat">${t('doneAt').replace('{t}',tm)}</span>`:''}</div></div>`:'';
const hero=`<div class="glass hero2${full?' isEx':''}"><div class="row"><div><div class="muted">${fD(new Date(),{weekday:'long',day:'numeric',month:'long'})}</div><b id="stT" class="stT"></b></div><span class="av" aria-hidden="true">${esc(ini(P().name))}</span></div>${full?'':`<div class="steps" id="steps">${PR.map(()=>'<i></i>').join('')}</div>`}</div>`;
/* a rest day: only the rest card (no prayers, Life Impact or Happiness to answer) */
if(full){v.classList.remove('ro');v.innerHTML=hero+(fem||e.isExempt?restCard():'');$('#stT').textContent=t('rToday');return}
v.innerHTML=banner+hero+(fem?restCard():'')+
(LK?'':`<div class="glass card honest"><p class="hm">${t('honM')}</p>${verseHTML(HV)}</div>`)+   // only while the day can still be answered
`<div id="prayers">${PR.map(k=>rs.includes(k)?`<div class="glass pc rest" data-p="${k}"><div class="row" style="min-height:72px"><div class="ph"><span class="nb" aria-hidden="true">${PR.indexOf(k)+1}</span><div class="pi"><div class="pt">${t('p_'+k)}</div><div class="ps">${t('rTitle')}</div></div></div><span class="rchip">${t('restShort')}</span></div></div>`:`<div class="glass pc" data-p="${k}"><div class="row" style="min-height:72px"><div class="ph" role="button" tabindex="0" data-a="pex"><span class="nb" aria-hidden="true">${PR.indexOf(k)+1}</span><div class="pi"><div class="pt">${t('p_'+k)}</div><div class="ps">${t('didPray')}</div></div></div>${yn('ans',`data-p="${k}" data-f="prayed"`)}</div>
<div class="ex"><div><div class="lv2">${['motive','manner'].map(f=>`<div class="row q${f==='motive'?' qm':''}" data-q="${f}"><span><span class="qtx"><small class="qk">${t('k_'+f)}</small>${t(f)}</span></span>${f==='motive'?mot(k):yn('ans',`data-p="${k}" data-f="${f}"`,'notQ')}</div>`).join('')}</div></div></div></div>`).join('')}</div>
<div class="glass card pc2 lockable" id="imp"><div class="ch"><span class="ti">${svg('spark')}</span><div class="pi"><div class="pt">${t('impact')}</div><div class="ps" id="impS"></div></div></div><div class="verse"><div class="ar" lang="ar">${VERSE.ar}</div><p class="tr">${esc(VERSE[DB.settings.lang])}</p><span class="ref">Quran 29:45</span></div><p>${t('impactQ')}</p>
<div class="opts">${[['better','✓'],['average','–'],['poor','✕']].map(([k,g])=>`<button class="opt" data-a="imp" data-v="${k}"><i aria-hidden="true">${g}</i>${t(k)}</button>`).join('')}</div><p class="hint">${t('unlock')}</p></div>
<div class="glass card pc2" id="hap"><div class="ch"><span class="ti">${svg('smile')}</span><div class="pi"><div class="pt">${t('pHap')}</div><div class="ps" id="hapS"></div></div></div><p>${t('hapQ')}</p>
<div class="opts" role="group" aria-label="${t('pHap')}">${[['well','✓'],['moderate','–'],['none','✕']].map(([k,g])=>`<button class="opt" data-a="hap" data-v="${k}" aria-pressed="false"><i aria-hidden="true">${g}</i>${t('hap_'+k)}</button>`).join('')}</div></div>
${LK?'':`<button class="btn pri wide" id="saveB" data-a="save">${t('save')}</button><p class="hint2" id="saveH" role="status"></p>`}`;
v.classList.toggle('ro',LK);
if(LK){$$('#view button[data-a=ans],#view button[data-a=imp],#view button[data-a=hap]').forEach(b=>b.disabled=true);
sync(asDraft(e))}else sync()}
const curD=()=>{const e=TD()[dk()];return e?asDraft(e):draft()};
function asDraft(e){const blank=()=>Object.fromEntries(PR.map(k=>[k,{prayed:null,motive:null,manner:null}]));return{p:e.prayers?JSON.parse(JSON.stringify(e.prayers)):blank(),impact:e.impact||null,hap:HAP.includes(e.happy)?e.happy:fromEmo(e.emotions)}}
function sync(D0){const D=D0||draft(),v=$('#view');
$$('[data-a=ans]',v).forEach(b=>{const val=D.p[b.dataset.p][b.dataset.f];b.classList.toggle('on',b.dataset.f==='motive'?val===b.dataset.v:val===(b.dataset.v==='1'))});
$$('.pc:not(.rest)',v).forEach(c=>{const x=D.p[c.dataset.p],left=(x.motive===null)+(x.manner===null),done=x.prayed!==null&&(x.prayed===false||!left);
c.classList.toggle('open',x.prayed===true&&(!done||c.classList.contains('exp')));c.classList.toggle('s-yes',x.prayed===true);c.classList.toggle('s-no',x.prayed===false);c.classList.toggle('done',done);
const ps=$('.ps',c);ps.textContent=x.prayed===null?t('didPray'):x.prayed===false?t('sNo'):done?t('sDone'):t('sLeft').replace('{n}',left);ps.className='ps'+(x.prayed===null?'':x.prayed===false?' miss':done?' ok':' warn');
$$('.q',c).forEach(r=>r.classList.toggle('answered',x[r.dataset.q]!==null))});
const rs=tR(),q=due();$$('#steps i',v).forEach((i,n)=>{const k=PR[n],x=D.p[k];i.className=rs.includes(k)?'r':x.prayed===true?'y':x.prayed===false?'n':''});
const an=q.filter(k=>saved()?D.p[k].prayed===true:D.p[k].prayed!==null).length;$('#stT').textContent=an+' / '+q.length;$('.hero2').classList.toggle('ok',!!saved()&&q.length>0&&an===q.length);   // saved with every due prayer done → green
$$('[data-a=imp]',v).forEach(b=>b.classList.toggle('on',D.impact===b.dataset.v));
$$('[data-a=hap]',v).forEach(b=>{const on=D.hap===b.dataset.v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
const u=unlocked(D);$('#imp').classList.toggle('locked',!u);
const st=(id,txt,cls)=>{const e=$(id);e.textContent=txt;e.className='ps'+(cls?' '+cls:'')};
st('#impS',u?(D.impact?t(D.impact):t('sPick')):t('sLocked'),u?(D.impact?'sel':'warn'):'');
st('#hapS',D.hap?t('hap_'+D.hap):t('sPick'),D.hap?'sel':'warn');
$('#imp').classList.toggle('done',u&&!!D.impact);$('#hap').classList.toggle('done',!!D.hap);
const sh=$('#saveH');if(sh)sh.textContent=valid(D)?'':t('hAns');   // one hint; unanswered questions are marked amber
const sb=$('#saveB');if(sb)sb.disabled=!valid(D)}
function doSave(){const D=draft();if(saved()||isRestDay(dk(),TD()[dk()])||!valid(D))return;const rs=tR(),u=unlocked(D),e={isExempt:false,prayers:JSON.parse(JSON.stringify(D.p)),impact:u?D.impact:null,happy:D.hap,savedAt:new Date().toISOString()};
PR.forEach(k=>{const x=e.prayers[k];if(rs.includes(k)){e.prayers[k]={prayed:false,motive:null,manner:null,rest:true};return}if(!x.prayed){x.motive=null;x.manner=null}});
TD()[dk()]=e;delete DB.drafts[S.pid][dk()];store();closeSheet();toast(t('savedToast'));vTrack()}
/* ---------- Analytics ---------- */
function stat(e){if(!e||e.isExempt||!e.prayers)return null;const p=PR.map(k=>e.prayers[k]),n=p.filter(x=>x.prayed).length;return{n,r:p.filter(x=>!x.rest).length,m:p.filter(x=>x.prayed&&x.motive==='purpose').length,q:p.filter(x=>x.prayed&&x.manner).length}}
const HG={well:'✓',moderate:'–',none:'✕'},hapBadge=h=>h?`<span class="bd h-${h}">${HG[h]} ${t('hap_'+h)}</span>`:`<span class="bd none">—</span>`;
const impBadge=i=>i?`<span class="bd ${i}">${{better:'✓',average:'–',poor:'✕'}[i]} ${t(i)}</span>`:`<span class="bd none">—</span>`;
function streak(){const td=TD();let d=new Date();if(!td[dk(d)])d.setDate(d.getDate()-1);let n=0;while(td[dk(d)]){n++;d.setDate(d.getDate()-1)}return n}
/* Progress: Today card + three 7-day charts that page together week by week. */
const EMO=['happy','sad','fear'],IMP=['better','average','poor'],IG={better:'✓',average:'–',poor:'✕'};
const pLoc=()=>DB.settings.lang==='ml'?'ml-IN':'en-IN';
/* one date style in every screen and the PDF: day first — "7 Nov 2026", "Sat, 7 Nov"; Malayalam "7 നവം 2026", "7 നവം, ശനി" */
function fD(d,o){d=d instanceof Date?d:new Date(d+'T00:00:00');const p=x=>d.toLocaleDateString(pLoc(),x);if(DB.settings.lang!=='ml')return p(o);
return[[o.day?d.getDate():'',o.month?p({month:o.month}):'',o.year?d.getFullYear():''].filter(x=>x!=='').join(' '),o.weekday?p({weekday:o.weekday}):''].filter(Boolean).join(', ')}
const d0=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate());
function dayOf(d){const k=dk(d);return{k,d:new Date(d),e:TD()[k]||null,pre:k<dk(new Date(P().createdAt))}}
/* same window as Insights: ends yesterday until today is saved, then today joins */
function wkDays(){const end=iWeek();end.setDate(end.getDate()-7*(S.wk||0));const o=[];for(let i=6;i>=0;i--){const d=new Date(end);d.setDate(d.getDate()-i);o.push(dayOf(d))}return o}
function earliest(){let m=dk(new Date(P().createdAt));for(const k in TD())if(k<m)m=k;return m}
function maxWk(){const a=new Date(earliest()+'T00:00:00'),n=iWeek(),diff=Math.round((n-a)/864e5);return Math.min(26,Math.max(0,Math.ceil((diff-6)/7)))}
function wnav(){const mx=maxWk();
return`<div class="wrow${mx?'':' off'}"><button class="wb" data-a="wk" data-v="1" aria-label="${t('prevWk')}">‹</button><div class="wsl"><input type="range" class="wkR" min="0" max="${mx||1}" step="1" value="${mx||1}" aria-label="${t('thisWk')}"${mx?'':' disabled'}><div class="wsl-l"><span class="wkA"></span><span>${t('thisWk')}</span></div></div><button class="wb" data-a="wk" data-v="-1" aria-label="${t('nextWk')}">›</button></div>`}
function updNav(){const mx=maxWk(),w=S.wk||0;
$$('.wrow .wb[data-v="1"]').forEach(b=>b.disabled=w>=mx);$$('.wrow .wb[data-v="-1"]').forEach(b=>b.disabled=!w);
const a=iWeek();a.setDate(a.getDate()-7*mx-6);const al=fD(a,{day:'numeric',month:'short'});
$$('.wkR').forEach(r=>{if(document.activeElement!==r||!$('#view').classList.contains('drag'))r.value=mx?mx-w:1;r.style.setProperty('--p',(mx?(mx-w)/mx*100:100)+'%')});
$$('.wkA').forEach(x=>x.textContent=al)}
function xAxis(days,y,cw){const loc=pLoc();return days.map((o,i)=>{const x=i*cw+cw/2,td=o.k===dk();
return`<text class="xd${td?' now':''}" x="${x}" y="${y}">${o.d.getDate()}</text><text class="xw" x="${x}" y="${y+14}">${o.d.toLocaleDateString(loc,{weekday:DB.settings.lang==='ml'?'narrow':'short'})}</text>`}).join('')}
function cols(days,h,cw){return days.map((o,i)=>`<rect class="colbg${o.k===dk()?' now':''}" data-k="${o.k}" x="${i*cw+2}" y="0" width="${cw-4}" height="${h}" rx="10"/>`).join('')}
function hits(days,h,cw){return days.map((o,i)=>`<rect class="hit" data-a="psel" data-v="${o.k}" x="${i*cw}" y="0" width="${cw}" height="${h}"/>`).join('')}
function ring(v,max,sz,w,cls,lb){const two=Array.isArray(lb),label=two?lb.join(' '):lb,r=(sz-w)/2,C=2*Math.PI*r,f=max?Math.min(v/max,1):0;
return`<div class="rgw"><svg class="rg ${cls}" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" role="img" aria-label="${label}: ${max?v+'/'+max:'—'}"><circle class="tr" cx="${sz/2}" cy="${sz/2}" r="${r}" stroke-width="${w}"/>${f?`<circle class="fg" cx="${sz/2}" cy="${sz/2}" r="${r}" stroke-width="${w}" stroke-dasharray="${f*C} ${C}" style="--c:${C}" transform="rotate(-90 ${sz/2} ${sz/2})"/>`:''}<text x="50%" y="50%" dy=".35em">${max?v+'/'+max:'—'}</text></svg><span class="rgl">${two?`<b>${lb[0]}</b><span>${lb[1]}</span>`:label}</span></div>`}
function vProgress(){S.wk=0;const td=TD(),today=dk(),e=td[today],fem=P().gender==='female';
let ex=0,tracked=0;
for(const k in td){tracked++;if(td[k].isExempt)ex++}
/* ---- Card 1: Today ---- */
const dl=fD(new Date(),{weekday:'short',day:'numeric',month:'short'});
let c1;
if(e&&e.isExempt)c1=`<div class="exc">${t('exCard')}</div>`;
else{const s=e?stat(e):{n:0,r:5,m:0,q:0};
c1=`<div class="rings">${ring(s.n,s.r,96,10,'s1',[t('rgPr'),t('rgPr2')])}${ring(s.m,e?s.n:0,96,10,'s2',[t('rgMo'),t('rgMo2')])}${ring(s.q,e?s.n:0,96,10,'s3',[t('rgMa'),t('rgMa2')])}</div>`}
if(e&&!e.isExempt)c1+=`<div class="tdl">
<div class="tdr"><span class="ti sm" aria-hidden="true">${svg('spark')}</span><span class="tdk">${t('impact')}</span><span class="tdv">${e.impact?impBadge(e.impact):`<span class="bd none">${t('noImp')}</span>`}</span></div>
<div class="tdr"><span class="ti sm" aria-hidden="true">${svg('smile')}</span><span class="tdk">${t('pHap')}</span><span class="tdv">${e.happy?hapBadge(e.happy):`<span class="bd none">${t('noHap')}</span>`}</span></div></div>`;
else if(!e)c1+=`<p class="tnone">${t('none')}</p><button class="btn ghost wide" data-a="tab" data-v="track">${t('goTrack')}</button>`;
c1+=`<div class="mini"><div><b>🔥 ${streak()}</b><span>${t('streakL')}</span></div><div><b>${tracked}</b><span>${t('daysL')}</span></div>${fem?`<div><b>${ex}</b><span>${t('restL')}</span></div>`:''}</div>`;
let h=`<div class="glass card pcard">${ch('cal',t('pToday'),`<span class="bd none dchip">${dl}</span>`)}${c1}</div>`;
/* ---- Cards 2–4: shells; SVGs are drawn by drawCharts() once widths are known ---- */
h+=`<div class="glass card pcard">${ch('track',t('pDaily'))}
<div class="lgd"><span><i class="sw s1"></i>${t('rgPr2')}</span><span><i class="sw s2"></i>${t('m_purpose')}</span><span><i class="sw s3"></i>${t('rgMa2')}</span>${fem?`<span><i class="sw rest"></i>${t('restShort')}</span>`:''}</div>
<div class="cx"><svg class="yax" width="24" height="${BH+40}">${[0,1,2,3,4,5].map(v=>`<text class="yl" x="18" y="${byv(v)}" dy=".35em">${v}</text>`).join('')}</svg><div class="sc" data-ch="bars"></div></div><div class="wn"></div></div>`;
const ylab=(keys,cls,lab=k=>t(k))=>`<svg class="yax lab" width="72" height="${DH+40}">${keys.map((k,j)=>`<circle class="${cls}-${k}" cx="5" cy="${RY[j]}" r="4"/><text class="yl l" x="13" y="${RY[j]}" dy=".35em">${lab(k)}</text>`).join('')}</svg>`;
h+=`<div class="glass card pcard">${ch('spark',t('impact'))}
<div class="cx">${ylab(IMP,'imp')}<div class="sc" data-ch="imp"></div></div>
<div class="wn"></div></div>`;
h+=`<div class="glass card pcard">${ch('smile',t('pHap'))}
<div class="cx">${ylab(HAP,'hap',k=>t('hs_'+k))}<div class="sc" data-ch="hap"></div></div>
<div class="wn"></div></div>`;
$('#view').innerHTML=h;
{let w=0;$$('#view .yax.lab text').forEach(x=>{try{w=Math.max(w,x.getBBox().width)}catch(_){}});if(w)$$('#view .yax.lab').forEach(ax=>ax.setAttribute('width',Math.ceil(13+w+10)))}
/* swipe left/right on any chart to change week */
$$('#view .cx').forEach(cx=>{let x0=null;cx.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
cx.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<50)return;stepWk(dx>0?1:-1)},{passive:true})});
S.sel=null;drawCharts()}
const BH=150,BT=10,byv=v=>BT+(1-v/5)*(BH-BT),RY=[22,62,102],DH=124;
function stepWk(n){const w=(S.wk||0)+n;if(w<0||w>maxWk())return;S.wk=w;S.sel=null;drawCharts()}
function drawCharts(){const days=wkDays();
$$('#view .wn').forEach(wn=>{if(!wn.firstChild)wn.innerHTML=wnav()});updNav();
$$('#view .sc').forEach(sc=>{const W=sc.clientWidth||300,cw=W/7,kind=sc.dataset.ch;let body='',H;
const bw=Math.max(5,Math.min(9,(cw-14)/3)),gp=Math.min(3,bw/3),tot=3*bw+2*gp,
rest=(i,y0,y1)=>`<rect class="rest" x="${i*cw+(cw-tot)/2}" y="${y0}" width="${tot}" height="${y1-y0}" rx="8"/><text class="restt" transform="translate(${i*cw+cw/2} ${(y0+y1)/2}) rotate(-90)" dy=".35em">${t('restShort')}</text>`,
nr=(i,y)=>`<circle class="nr" cx="${i*cw+cw/2}" cy="${y}" r="2.5"/>`;
if(kind==='bars'){H=BH+40;
for(let v=0;v<=5;v++)body+=`<line class="gl${v===0?' base':''}" x1="0" x2="${W}" y1="${byv(v)}" y2="${byv(v)}"/>`;
days.forEach((o,i)=>{if(o.pre)return;const x0=i*cw+(cw-tot)/2;
if(!o.e){body+=nr(i,byv(0)-4);return}
if(o.e.isExempt){body+=rest(i,byv(5),byv(0));return}
const s=stat(o.e);[[s.n,'s1'],[s.m,'s2'],[s.q,'s3']].forEach(([v,c],j)=>{const y=v?byv(v):byv(0)-2;body+=`<rect class="bar ${c}" x="${x0+j*(bw+gp)}" y="${y}" width="${bw}" height="${byv(0)-y}" rx="3" style="animation-delay:${i*40}ms"/>`})});
body=cols(days,BH+4,cw)+body+xAxis(days,BH+18,cw)+hits(days,H,cw)}
else{H=DH+40;body=cols(days,DH+6,cw)+RY.map(y=>`<line class="gl band" x1="0" x2="${W}" y1="${y}" y2="${y}"/>`).join('');
/* Life Impact and Happiness: a dot with ✓ – ✕ on each answered day.
   Next-day answers are joined by a solid line; a day without an answer between them gets a faint dashed line,
   plus the same mark the Daily prayers chart uses: "Rest" pill for a rest day, small grey dot for any other day with no answer. */
const LV=kind==='imp'?{keys:IMP,f:'impact',g:IG,mid:'average'}:{keys:HAP,f:'happy',g:HG,mid:'moderate'};
let solid='',dash='',marks='',dots='',prev=null;days.forEach((o,i)=>{if(o.pre)return;const v=o.e&&o.e[LV.f];
if(o.e&&o.e.isExempt){marks+=rest(i,RY[0]-12,RY[2]+12);return}   /* rest day: nothing was asked */
if(!v||!LV.keys.includes(v)){marks+=nr(i,DH-4);return}
const x=i*cw+cw/2,y=RY[LV.keys.indexOf(v)];
if(prev){const seg=`M${prev.x} ${prev.y} L${x} ${y} `;if(i===prev.i+1)solid+=seg;else dash+=seg}prev={i,x,y};
dots+=`<g class="pt"><circle class="${kind}-${v}" cx="${x}" cy="${y}" r="9"/><text class="pg${v===LV.mid?' dk':''}" x="${x}" y="${y}" dy=".35em">${LV.g[v]}</text></g>`});
body+=(dash?`<path class="ln gap" d="${dash}"/>`:'')+marks+(solid?`<path class="ln" d="${solid}"/>`:'')+dots;
body+=xAxis(days,DH+18,cw)+hits(days,H,cw)}
sc.innerHTML=`<svg width="${W}" height="${H}" role="img" aria-label="${t(kind==='bars'?'pDaily':kind==='imp'?'impact':'pHap')}">${body}</svg>`});
const last=[...days].reverse().find(o=>o.e&&!o.pre);progSel(S.sel&&days.some(o=>o.k===S.sel)?S.sel:(last?last.k:days[6].k))}
function progSel(k){const o=wkDays().find(x=>x.k===k);if(!o)return;S.sel=k;

const dt=`<b>${fD(o.d,{weekday:'short',day:'numeric',month:'short'})}</b>`,e=o.e;
const set=(id,txt)=>{const el=$(id);if(el)el.innerHTML=dt+`<span>${txt}</span>`};
if(!e){[3,4].forEach(n=>set('#det'+n,t(k===dk()?'pending':'nr')));return}
set('#det3',e.impact?impBadge(e.impact):t('noImp'));
set('#det4',e.happy?hapBadge(e.happy):t('noHap'))}
/* shared helpers */
/* the week (Progress) and the Insights window end yesterday until today is saved; once today is saved it joins */
function iWeek(){const today=d0(new Date());return TD()[dk(today)]?today:addD(today,-1)}
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
/* ---------- Insights ----------
   The last 7 days (ending yesterday until today is saved, like Progress); it starts from the first saved day and grows to 7.
   Rest days (and rest prayers of a part day) are left out of everything. A day marked "not prayed" and a day not recorded
   count the same: its due prayers were missed.
   Prayer: 1 Consistency · 2 Motive · 3 Manner — one line each.  Prayer in life: 4 Life Impact — one line ·
   5 Happiness — each day's feeling set against whether the day earned it (every due prayer performed, with purpose,
   on time and in the right way, and a strong Life Impact). If no prayer was performed at all, 2–4 are not shown. */
const IWIN=7;
const tf=(k,o={})=>{let s=Object.entries(o).reduce((a,[x,v])=>a.split('{'+x+'}').join(v),t(k));
return DB.settings.lang==='ml'?s:s.replace(/\b1(\uE001?) (exempt |saved )?days\b/g,'1$1 $2day').replace(/All of the last 1 day were exempt days/,'The last day was an exempt day').replace(/\b1(\uE001?) (exempt )?prayers\b/g,'1$1 $2prayer').replace(/^((?:\uE000\w+\uE002)?1\uE001? of [^.]*?) were\b/,'$1 was')};
/* PDF only: a sentence number can carry its graph colour (k = c/p/x/r/ok2/w2). Invisible markers survive the
   English singular rules above; buildReport turns them into coloured chips. Insights never sets NC. */
let NC=false;const nc=(n,k)=>NC?`\uE000${k}\uE002${n}\uE001`:n,ncHTML=s=>s.replace(/\uE000(\w+)\uE002(\d+)\uE001/g,'<b class="nc g-$1">$2</b>');
/* the window: rest days counted apart, recorded days with their stats, unrecorded days with the prayers that were due */
function iRange(from,to){const td=TD(),cr=dk(new Date(P().createdAt)),o={days:0,rest:0,pd:[],un:[]};
for(let d=d0(from);d<=to;d=addD(d,1)){const k=dk(d),e=td[k];if(k<cr&&!e)continue;o.days++;
 if(isRestDay(k,e)){o.rest++;continue}
 if(!e){o.un.push({k,due:PR.filter(p=>!restOf(k).includes(p))});continue}
 const s=stat(e);if(s)o.pd.push({k,e,s})}
o.nd=o.days-o.rest;o.rp=o.pd.reduce((x,a)=>x+5-a.s.r,0)+o.un.reduce((x,a)=>x+5-a.due.length,0);o.T=o.pd.reduce((x,a)=>x+a.s.r,0)+o.un.reduce((x,a)=>x+a.due.length,0);o.P=o.pd.reduce((x,a)=>x+a.s.n,0);return o}
/* Insights: the last 7 days (until today is saved they end yesterday) */
const iData=()=>{const end=iWeek();return iRange(addD(end,-(IWIN-1)),end)};
const ok1=txt=>({tone:'s',ic:'track',txt}),warn=(ic,txt)=>({tone:'n',ic,txt});
/* 1. Consistency: due prayers vs performed, with the missed ones by prayer (most first) */
/* a part day (start / end of a rest period) has fewer than 5 due prayers: say so, or 24 of 5 days looks wrong */
function aCons(D){const m=D.T-D.P,rx=D.rp?tf('cRx',{x:D.rp}):'';if(!m)return[ok1(tf('c1_A',{n:D.nd,t:D.T,rx}))];
const c={};PR.forEach(p=>c[p]=0);
D.pd.forEach(o=>PR.forEach(p=>{const x=o.e.prayers[p];if(!x.rest&&!x.prayed)c[p]++}));D.un.forEach(o=>o.due.forEach(p=>c[p]++));
const list=PR.filter(p=>c[p]).sort((a,b)=>c[b]-c[a]||PR.indexOf(a)-PR.indexOf(b)).map(p=>t('p_'+p)+' '+c[p]).join(', ');
return[warn('repeat',tf('c1_B',{t:D.T,m:nc(m,'x'),l:list,rx}))]}
/* 2. Motive and 3. Manner: among performed prayers */
function aPer(D,f,ic,A,B){let p=0,y=0;D.pd.forEach(o=>PR.forEach(k=>{const x=o.e.prayers[k];if(!x.prayed)return;p++;if(f(x))y++}));
return[y===p?ok1(tf(A,{p})):warn(ic,tf(B,{p,w:nc(p-y,'p')}))]}
/* 4. Life Impact: every counted day; a day without an answer (prayers missed or not recorded) cannot be assessed */
function aImp(D){const c={better:0,average:0,poor:0};D.pd.forEach(o=>{if(IMP.includes(o.e.impact))c[o.e.impact]++});
if(c.better===D.nd)return[ok1(tf('o1_A',{n:D.nd}))];
const na=D.nd-c.better-c.average-c.poor,parts=[c.average&&tf('o_mod',{x:nc(c.average,'p')}),c.poor&&tf('o_poor',{x:nc(c.poor,'x')}),na&&tf('o_na',{x:nc(na,'r')})].filter(Boolean);
return[warn('spark',tf('o1_B',{n:D.nd,l:parts.join(', ')}))]}
/* 5. Happiness: earned (a complete day) or not × felt well or not; only the groups that have days */
function aHap(D){const hd=D.pd.filter(o=>HAP.includes(o.e.happy));if(!hd.length)return null;
const earned=o=>o.s.r>0&&o.s.n===o.s.r&&o.s.m===o.s.r&&o.s.q===o.s.r&&o.e.impact==='better',well=o=>o.e.happy==='well';
const g=[['h_a',o=>earned(o)&&well(o),'s','track','c'],['h_b',o=>earned(o)&&!well(o),'g','smile','ok2'],['h_c',o=>!earned(o)&&well(o),'n','smile','w2'],['h_d',o=>!earned(o)&&!well(o),'n','smile','p']];
return g.map(([k,f,tone,ic,gk])=>{const x=hd.filter(f).length;return x?{tone,ic,gk,txt:tf(k,{x:nc(x,gk)})}:null}).filter(Boolean)}
/* the five areas, in order; if no prayer was performed, Motive, Manner and Life Impact cannot be assessed */
function iAreas(D){const none=D.nd>0&&D.P===0,A=[['cons','repeat',t('ia_cons'),aCons(D)]],B=[];
if(!none)A.push(['mot','target',t('ia_mot'),aPer(D,x=>x.motive==='purpose','target','m1_A','m1_B')],['man','eye',t('ia_man'),aPer(D,x=>!!x.manner,'eye','q1_A','q1_B')]);
if(!none)B.push(['imp','spark',t('impact'),aImp(D)]);B.push(['hap','smile',t('pHap'),aHap(D)]);
const has=x=>x[3]&&x[3].length;return{none,A:A.filter(has),B:B.filter(has)}}
/* each part stays whole on one line ("1 ദിവസം രേഖപ്പെടുത്തിയില്ല" never splits); lines break only at the dots */
const iParts=D=>[D.pd.length&&tf('iRecX',{x:D.pd.length}),D.rest&&tf('iRestX',{x:D.rest}),D.un.length&&tf('iUnX',{x:D.un.length})].filter(Boolean).map(s=>`<span class="nw">${esc(s)}</span>`);
const iLine=(x,i)=>`<li${i?'':' class="base"'}>${x.tone==='x'?`<span class="ti sm l-x" aria-hidden="true">${svg(x.ic)}</span>`:`<span class="imk imk-${x.tone||'g'}" aria-hidden="true">${x.tone==='s'?'✓':x.tone==='n'?'!':'•'}</span>`}<span>${x.txt}</span></li>`;
/* the card's verse sits under its message, always (same box as the Track card's verse) */
const verseHTML=v=>`<div class="verse"><div class="ar" lang="ar" dir="rtl">${v.ar}</div><p class="tr">${esc(v[DB.settings.lang]||v.en)}</p><span class="ref">Quran ${v.ref}</span></div>`;
function iCard(id,ic,title,L){if(!L||!L.length)return'';
return`<div class="glass card icard" data-ia="${id}"><div class="lh"><span class="ti" aria-hidden="true">${svg(ic)}</span><h3 class="lt">${title}</h3></div><ul class="plist">${L.map(iLine).join('')}</ul>${IVR[id]?verseHTML(IVR[id]):''}</div>`}
const iMsg=(ic,txt)=>`<div class="glass card icard solo"><ul class="plist">${iLine({tone:'x',ic,txt},1)}</ul></div>`;
/* hero: "N days" in bold (1–7), then how those days were: recorded · rest · not recorded (only the ones there are) */
function vInsights(){const D=iData(),e=D.days,c=D.nd,parts=iParts(D),Z=c?iAreas(D):null,card=x=>iCard(...x);
let h=c?`<div class="glass card lhero"><h2>${tf('iBaseA',{e})}</h2>${parts.length?`<p class="lr">${parts.join(' · ')}</p>`:''}${Z.none?`<p class="lnone">${t('iNone')}</p>`:''}</div>`:'';   // nothing to base it on (no day yet, or rest days only): the message card alone says why
if(!e)h+=iMsg('insights',t('iFirst'));
else if(!c)h+=iMsg('moon',tf('iAllRest',{n:e}));   /* no hero here, so the message names the days itself */
else h+=`<h2 class="sec">${t('iSecA')}</h2>${Z.A.map(card).join('')}`+(Z.B.length?`<h2 class="sec">${t('iSecB')}</h2>${Z.B.map(card).join('')}`:'');
$('#view').innerHTML=h+(Object.keys(TD()).length?`<button class="btn ghost wide pdfb" data-a="pdf">${svg('doc')}<span>${t('pdfT')}</span></button>`:'')+`<p class="inote">${t('iNote')}</p>`}
/* ---------- Profile ---------- */
/* Profile: the person (name, joined date, streak), then every action as its own tile:
   Account (switch, edit name) · Data management (export, import, delete days) · Delete profile at the very end */
function vProfile(){const p=P(),j=fD(new Date(p.createdAt),{day:'numeric',month:'short',year:'numeric'}),n=streak();
const a=(k,ic,ti,su,cls='')=>`<button class="act tile ${cls}" data-a="${k}"><span class="ti sm" aria-hidden="true">${svg(ic)}</span><span class="al">${t(ti)}${su?`<small>${t(su)}</small>`:''}</span><span class="chev" aria-hidden="true">›</span></button>`;
$('#view').innerHTML=`<div class="glass me2"><span class="av big" aria-hidden="true">${esc(ini(p.name))}</span><h2>${esc(p.name)}</h2>
<div class="mstats"><div class="mst"><small>${t('joined')}</small><b><span class="mi" aria-hidden="true">${svg('cal')}</span>${j}</b></div><div class="mst"><small>${t('strk')}</small><b><span class="mi" aria-hidden="true">🔥</span>${tf('nDays',{n})}</b></div></div></div>
<h2 class="sec">${t('grpAcc')}</h2><div class="tiles">${a('sw','sw','switchP')}${a('editN','ed','editN')}</div>
<h2 class="sec">${t('dm')}</h2><div class="tiles">${a('exp','dl','expT','expS')}${a('impPick','ul','impT','impS')}${a('dDel','tr','dDelR','dDelS','dng')}</div>
<div class="tiles tlast">${a('del','tr','del','','dng')}</div>`}
/* ---------- Bottom sheets (History-API aware) ---------- */
let sheetOpen=false,lastFocus=null;
function openSheet(html,danger){lastFocus=document.activeElement;const s=$('#sheet');s.className=danger?'danger':'';s.dataset.k='';s.innerHTML=html;s.setAttribute('aria-hidden','false');
requestAnimationFrame(()=>{s.classList.add('on');$('#scrim').classList.add('on');const f=$('input,button.btn',s);f&&f.focus()});
if(!sheetOpen){history.pushState({sheet:1},'');sheetOpen=true}}
function closeSheet(silent){const s=$('#sheet');if(!sheetOpen&&!s.classList.contains('on'))return;s.classList.remove('on');$('#scrim').classList.remove('on');s.setAttribute('aria-hidden','true');
if(sheetOpen){sheetOpen=false;if(!silent&&history.state&&history.state.sheet)history.back()}lastFocus&&lastFocus.focus&&lastFocus.focus()}
const confirmSheet=(title,msg,btn,act,danger)=>openSheet(`<h3>${title}</h3><p class="msg">${msg}</p><div class="btns"><button class="btn ${danger?'dng':'pri'}" data-a="${act}">${btn}</button><button class="btn ghost" data-a="close">${t('cancel')}</button></div>`,danger);
function editSheet(){openSheet(`<h3>${t('editN')}</h3><p class="msg">${t('editQ')}</p><input id="nn" class="inp" maxlength="${MAXN}" value="${esc(P().name)}" aria-label="${t('pname')}"><p class="err" id="nerr" role="alert"></p><div class="btns"><button class="btn pri" data-a="editSave">${t('saveName')}</button><button class="btn ghost" data-a="close">${t('cancel')}</button></div>`)}
/* ---------- Data management (Profile tab): export, import and delete — for the open profile only ---------- */
/* Export: one JSON file with this profile and its saved days (same layout as before, so every version can read it) */
function doExport(){const p=P();if(!p)return;
const data={app:'self-regulation-mastery',type:'backup',schemaVersion:2,exportedAt:new Date().toISOString(),profiles:{[p.id]:p},trackingData:{[p.id]:TD()}};
const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,1)],{type:'application/json'})),a=document.createElement('a'),nm=p.name.replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')||'profile';
a.href=url;a.download=`srm-${nm}-${dk()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);toast(t('expDone'))}
/* Import step 1: read and check the file. Every day is rebuilt from known fields only, so a damaged or foreign file can never break the app. */
const isoOk=v=>typeof v==='string'&&!isNaN(Date.parse(v));
function cleanDay(e){if(!e||typeof e!=='object')return null;const emo=Array.isArray(e.emotions)?[...new Set(e.emotions.filter(x=>EMO.includes(x)))]:[];
const imp=['better','average','poor'].includes(e.impact)?e.impact:null,sv=isoOk(e.savedAt)?e.savedAt:null;
const hp=HAP.includes(e.happy)?e.happy:fromEmo(emo),old=o=>{if(emo.length)o.emotions=emo;return o};   // an old file's Emotions stay as they were; nothing new is written
if(e.isExempt===true){const o=old({isExempt:true,prayers:null,impact:imp,happy:hp,savedAt:sv});if(e.auto===true)o.auto=true;return o} // kept as saved; a rest day's answers are never used
if(!e.prayers||typeof e.prayers!=='object')return null;const pr={};
for(const k of PR){const x=e.prayers[k];if(!x||typeof x.prayed!=='boolean')return null;
 pr[k]=x.rest===true?{prayed:false,motive:null,manner:null,rest:true}:x.prayed?{prayed:true,motive:['habit','pressure','purpose','unknown'].includes(x.motive)?x.motive:'unknown',manner:x.manner===true}:{prayed:false,motive:null,manner:null}}
const dq=PR.filter(k=>!pr[k].rest);if(!dq.length)return null;
return old({isExempt:false,prayers:pr,impact:dq.every(k=>pr[k].prayed)?imp:null,happy:hp,savedAt:sv})}
function readBackup(txt){let d;try{d=JSON.parse(txt)}catch(e){return null}
if(!d||typeof d!=='object'||!d.profiles||typeof d.profiles!=='object'||!d.trackingData||typeof d.trackingData!=='object')return null;
d=migrate({schemaVersion:d.schemaVersion||1,settings:{},drafts:{},profiles:d.profiles,trackingData:d.trackingData}); // old Yes/No motive -> words
const out={profiles:{},trackingData:{},days:0,skip:0,first:null,last:null},today=dk();
for(const [key,p] of Object.entries(d.profiles)){if(!p||typeof p.name!=='string'||!p.name.trim()||!['male','female'].includes(p.gender))continue;
 const id=typeof p.id==='string'&&/^[\w-]{1,40}$/.test(p.id)?p.id:key;
 out.profiles[id]={id,name:p.name.trim().replace(/\s+/g,' ').slice(0,MAXN),gender:p.gender,createdAt:isoOk(p.createdAt)?p.createdAt:new Date().toISOString()};
 const KD=/^\d{4}-\d{2}-\d{2}$/,ix=n=>Number.isInteger(n)&&n>=0&&n<5;
 const rs=p.gender==='female'&&Array.isArray(p.rest)?p.rest.filter(r=>r&&KD.test(r.s)&&r.s<=today&&ix(r.sp)&&(r.e==null||(KD.test(r.e)&&r.e>=r.s&&r.e<=today&&ix(r.ep)))).map(r=>({s:r.s,sp:r.sp,e:r.e||null,ep:r.e?r.ep:null})):[];
 if(rs.length)out.profiles[id].rest=rs;
 const days=d.trackingData[key]||d.trackingData[id]||{},td=out.trackingData[id]={};
 for(const [k,e] of Object.entries(days)){if(!/^\d{4}-\d{2}-\d{2}$/.test(k)||k>today){out.skip++;continue}const c=cleanDay(e);if(!c){out.skip++;continue}
  td[k]=c;out.days++;if(!out.first||k<out.first)out.first=k;if(!out.last||k>out.last)out.last=k}}
return Object.keys(out.profiles).length?out:null}
let pendImp=null;
const fmtD=k=>fD(k,{day:'numeric',month:'short',year:'numeric'});
const sheetSet=(html,danger,k)=>{if(sheetOpen){$('#sheet').classList.toggle('danger',!!danger);$('#sheet').innerHTML=html;$('#sheet').dataset.k=k}else{openSheet(html,danger);$('#sheet').dataset.k=k}};
const badImp=()=>sheetSet(`<h3>${t('impBadT')}</h3><p class="msg">${t('impBad')}</p><div class="btns"><button class="btn pri" data-a="close">${t('okB')}</button></div>`,true,'imp');
/* Import step 2: one profile of the file is chosen (a file from this app's older "all profiles" backup can hold several) */
function importFile(f){if(!f)return;if(f.size>5e6)return badImp();
const r=new FileReader();r.onload=()=>{const b=readBackup(String(r.result));pendImp=b;if(!b)return badImp();
 const ps=Object.values(b.profiles),me=P(),low=n=>n.trim().toLocaleLowerCase();
 const one=ps.length===1?ps[0]:ps.find(x=>x.id===me.id)||ps.find(x=>low(x.name)===low(me.name)&&x.gender===me.gender);
 if(one)return impAsk(one.id);
 sheetSet(`<h3>${t('impPickT')}</h3><p class="msg">${esc(tf('impPickS',{n:me.name}))}</p><div class="glass list">${ps.map(x=>`<button class="act" data-a="impP" data-id="${esc(x.id)}"><span class="av" aria-hidden="true">${esc(ini(x.name))}</span><span class="al">${esc(x.name)}<small>${tf('impPD',{d:Object.keys(b.trackingData[x.id]||{}).length})}</small></span><span class="chev" aria-hidden="true">›</span></button>`).join('')}</div>
 <div class="btns"><button class="btn ghost" data-a="close">${t('cancel')}</button></div>`,false,'imp')};
r.onerror=()=>{pendImp=null};r.readAsText(f)}
/* Import step 3: confirm, showing what will be added to the open profile */
function impAsk(id){const b=pendImp;if(!b||!b.profiles[id])return;b.pick=id;const ks=Object.keys(b.trackingData[id]||{}).sort(),sk=b.skip;
 sheetSet(`<h3>${t('impQT')}</h3><p class="msg">${esc(tf('impQ',{d:ks.length,a:ks.length?fmtD(ks[0]):'–',b:ks.length?fmtD(ks[ks.length-1]):'–',n:P().name}))}${sk?' '+t('impSkip').replace('{s}',sk):''}</p>
 <div class="btns"><button class="btn pri" data-a="impGo">${t('impB')}</button><button class="btn ghost" data-a="close">${t('cancel')}</button></div>`,false,'imp')}
/* Import step 4: merge into the open profile. A day that exists on both sides keeps the newer save. Nothing is ever deleted.
   Rest periods come along only into a female profile. */
function mergeInto(b){const id=b.pick,p=b.profiles[id],tg=P();let nd=0,up=0;
 if(p.createdAt<tg.createdAt)tg.createdAt=p.createdAt; // keep the earliest start so older imported days still count
 /* rest periods: same start day = same period (an ended one wins over one still open); only the latest may stay open */
 if(p.rest&&tg.gender==='female'){const cur=tg.rest||(tg.rest=[]);for(const r of p.rest){const o=cur.find(x=>x.s===r.s);if(!o)cur.push({...r});else if(!o.e&&r.e){o.e=r.e;o.ep=r.ep}}
  cur.sort((a,b)=>a.s<b.s?-1:1);for(let i=0;i<cur.length-1;i++)if(!cur[i].e){cur[i].e=cur[i+1].s;cur[i].ep=0}}
 const td=DB.trackingData[tg.id]||(DB.trackingData[tg.id]={});
 for(const [k,e] of Object.entries(b.trackingData[id]||{})){const o=td[k];if(!o){td[k]=e;nd++}else if((e.savedAt||'')>(o.savedAt||'')){td[k]=e;up++}}
 store();return{nd,up}}
/* ---------- PDF summary ----------
   The browser prints an A4 report ("Save as PDF"): Malayalam text stays perfect, it works offline, no server.
   It is the Insights analysis (same rules, same sentences, no verses) for the dates the user picks:
   from the first tracked day to the last tracked day by default, and never outside them. Current profile only. */
function pdfLim(){const ks=Object.keys(TD()).sort();return ks.length?{min:ks[0],max:ks[ks.length-1]}:null}
const PMAX=31,nDay=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5)+1;
/* the last 31 days up to the last tracked day (fewer if tracking started later) */
function lastRange(L){const a=dk(addD(new Date(L.max+'T00:00:00'),-(PMAX-1)));return{a:a<L.min?L.min:a,b:L.max}}
/* the sheet: "Last 31 days" (default, one tap) or "Choose dates" (any span of up to 31 days) */
function pdfSheet(){const L=pdfLim();if(!L)return toast(t('pdfNone'));
openSheet(`<h3>${t('pdfT')}</h3><p class="msg">${t('pdfHint')}</p>
<div class="seg full" role="group" aria-label="${t('pdfT')}"><button data-a="pdfMode" data-v="last" class="on" aria-pressed="true">${t('pdfLast')}</button><button data-a="pdfMode" data-v="pick" aria-pressed="false">${t('pdfPick')}</button></div>
<div id="pdfBody"></div><p class="err" id="pdfE" role="alert"></p>
<div class="btns"><button class="btn pri" data-a="pdfGo">${svg('doc')}${t('pdfGo')}</button><button class="btn ghost" data-a="close">${t('cancel')}</button></div>`);$('#sheet').dataset.k='pdf';pdfMode('last')}
function pdfMode(m){const L=pdfLim(),B=$('#pdfBody');if(!L||!B)return;$('#sheet').dataset.m=m;$('#pdfE').textContent='';
$$('[data-a=pdfMode]').forEach(x=>{const on=x.dataset.v===m;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
const R=lastRange(L);
if(m==='last'){B.innerHTML=`<div class="rng">${svg('cal')}<div><b>${fmtD(R.a)} – ${fmtD(R.b)}</b><small>${tf('nDays',{n:nDay(R.a,R.b)})}</small></div></div>`;return}
const inp=(id,lab,v)=>`<div><label class="lbl" for="${id}">${t(lab)}</label><input type="date" id="${id}" class="inp" min="${L.min}" max="${L.max}" value="${v}"></div>`;
B.innerHTML=`<div class="dates">${inp('pdfA','pdfFrom',R.a)}${inp('pdfB','pdfTo',R.b)}</div><p class="rmax">${t('pdfMax')}</p>`}
function pdfGo(){const L=pdfLim(),E=$('#pdfE'),re=/^\d{4}-\d{2}-\d{2}$/;if(!L)return;let a,b;
if($('#sheet').dataset.m==='pick'){a=$('#pdfA').value;b=$('#pdfB').value;
 if(!re.test(a)||!re.test(b)||a>b)return E.textContent=t('pdfErr');
 if(a<L.min||b>L.max)return E.textContent=tf('pdfRange',{a:fmtD(L.min),b:fmtD(L.max)});
 if(nDay(a,b)>PMAX)return E.textContent=t('pdfMaxE')}
else({a,b}=lastRange(L));
const html=buildReport(a,b),pr=$('#print'),tt=document.title;pr.innerHTML=html;pr.lang=DB.settings.lang;document.body.classList.add('printing');
document.title=`SRM ${P().name} ${a} – ${b}`;const back=()=>{document.title=tt;document.body.classList.remove('printing');removeEventListener('afterprint',back)};addEventListener('afterprint',back);
closeSheet();fitPage(pr).then(()=>setTimeout(()=>window.print(),80))}
/* one A4 page, always: measure the report at A4 width once the fonts are ready; if it is taller than the page, shrink it to fit */
function fitPage(pr){pr.style.zoom=pr.style.width='';
const go=()=>{pr.classList.add('measure');const mm=96/25.4,h=pr.scrollHeight;pr.classList.remove('measure');
 if(h>297*mm){const z=Math.floor(297*mm/h*1000)/1000;pr.style.zoom=String(z);pr.style.width=(210/z).toFixed(2)+'mm'}}; // zoom scales lengths too: 210/z mm keeps the full A4 width
 return(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(go,go)}
function buildReport(a,b){const D=iRange(new Date(a+'T00:00:00'),new Date(b+'T00:00:00')),c=D.nd,parts=iParts(D);let Z=null;
NC=true;try{if(c)Z=iAreas(D)}finally{NC=false}
/* Happiness marks take the colour of their bar segment */
const mk=x=>{const h=x.gk?' g-'+x.gk:'';return x.tone==='s'?`<span class="mk ok${h}">✓</span>`:x.tone==='n'?`<span class="mk no${h}">!</span>`:`<span class="mk${h}">•</span>`};
const G=rGraphs(D,a,b),area=x=>`<section class="ra"><div class="rah"><h3>${x[2]}</h3>${G[x[0]]||''}</div>${x[3].map(l=>`<p class="rl">${mk(l)}<span>${ncHTML(l.txt)}</span></p>`).join('')}</section>`;
return`<header class="rh"><img src="icon-192.png" alt=""><div><h1>Self Regulation Mastery</h1><p>${t('rpTitle')}</p></div></header>
<dl class="meta"><dt>${t('rpName')}</dt><dd>${esc(P().name)}</dd><dt>${t('rpPeriod')}</dt><dd>${fmtD(a)} – ${fmtD(b)}</dd><dt>${t('rpMade')}</dt><dd>${fmtD(dk())}</dd></dl>
<p class="head">${tf('iBaseA',{e:D.days})}</p>${parts.length?`<p class="rsub">${parts.join(' · ')}</p>`:''}${c&&Z.none?`<p class="rnone">${t('iNone')}</p>`:''}${G.map}
${!c?`<p class="rl"><span>${t('pdfAllRest')}</span></p>`:`<h2>${t('iSecA')}</h2>${Z.A.map(area).join('')}${Z.B.length?`<h2>${t('iSecB')}</h2>${Z.B.map(area).join('')}`:''}`}
<p class="rfoot">${t('iNote')}</p>`}
/* PDF graphs (print-light, colours from COLOR.html's diverging scale: green good, amber shortfall, red missed; grey = rest / not assessed).
   Same counting as the sentences above them, so every number on the page agrees.
   map: one cell per prayer per day (max 31 days) + per-prayer Consistency / Motive / Manner counts + legend.
   Each area: one thin bar beside its title; the sentence's coloured numbers name its segments (no legend needed). */
function rGraphs(D,a,b){const td=TD(),cr=dk(new Date(P().createdAt)),days=[];
for(let d=new Date(a+'T00:00:00');dk(d)<=b;d=addD(d,1)){const k=dk(d),e=td[k];if(k<cr&&!e)continue;
 if(isRestDay(k,e)){days.push({k,c:PR.map(()=>'r')});continue}
 if(!e){const ro=restOf(k);days.push({k,c:PR.map(p=>ro.includes(p)?'r':'u')});continue}
 if(!stat(e)){days.push({k,c:PR.map(()=>'n')});continue}
 days.push({k,c:PR.map(p=>{const x=e.prayers[p];return x.rest?'r':!x.prayed?'x':(x.motive==='purpose'&&x.manner)?'c':'p'})})}
const cnt={c:0,p:0,x:0,u:0,r:0,n:0},P5=PR.map(()=>({due:0,pr:0,pur:0,man:0}));
days.forEach(d=>PR.forEach((p,r)=>{const c=d.c[r],o=P5[r];cnt[c]++;if(c==='r'||c==='n')return;o.due++;if(c==='x'||c==='u')return;o.pr++;
 const x=td[d.k].prayers[p];if(x.motive==='purpose')o.pur++;if(x.manner)o.man++}));
const sum=k=>P5.reduce((s,o)=>s+o[k],0),N=31,pad=n=>'<span></span>'.repeat(n);
const sw=([k,l,n])=>`<span><i class="g-${k}"></i>${l} <b>${n}</b></span>`,lgd=L=>`<span class="lgd">${L.filter(x=>x[2]).map(sw).join('')}</span>`;
const bar=L=>`<span class="sb">${L.filter(x=>x[1]).map(([k,n])=>`<i class="g-${k}" style="flex:${n}"></i>`).join('')}</span>`; // segment order = order of the coloured numbers in the sentence
let g=`<div class="mg"><span></span>${days.map((d,j)=>`<span class="mo">${j===0||d.k.endsWith('-01')?fD(d.k,{month:'short'}):''}</span>`).join('')}${pad(N-days.length+1)}${['ia_cons','ia_mot','ia_man'].map(x=>`<span class="nh">${t(x)}</span>`).join('')}`;
PR.forEach((p,r)=>{const o=P5[r];g+=`<span class="pl">${t('p_'+p)}</span>${days.map(d=>`<i class="g-${d.c[r]}"></i>`).join('')}${pad(N-days.length+1)}${[[o.pr,o.due],[o.pur,o.pr],[o.man,o.pr]].map(([x,y])=>`<span class="nm">${x}/${y}</span>`).join('')}`});
g+=`<span></span>${days.map(d=>`<span class="dn">${+d.k.slice(8)}</span>`).join('')}${pad(N-days.length+4)}</div>`;
const map=`<section class="map"><h3>${t('rMap')}</h3>${g}${lgd([['c',t('rC'),cnt.c],['p',t('rS'),cnt.p],['x',t('rX'),cnt.x],['u',t('rU'),cnt.u],['r',t('rR'),cnt.r]])}</section>`;
const im={better:0,average:0,poor:0};D.pd.forEach(o=>{if(IMP.includes(o.e.impact))im[o.e.impact]++});
const hd=D.pd.filter(o=>HAP.includes(o.e.happy)),earned=o=>o.s.r>0&&o.s.n===o.s.r&&o.s.m===o.s.r&&o.s.q===o.s.r&&o.e.impact==='better',well=o=>o.e.happy==='well',hn=f=>hd.filter(f).length;
return{map,
 cons:bar([['c',sum('pr')],['x',sum('due')-sum('pr')]]),
 mot:bar([['c',sum('pur')],['p',sum('pr')-sum('pur')]]),
 man:bar([['c',sum('man')],['p',sum('pr')-sum('man')]]),
 imp:bar([['c',im.better],['p',im.average],['x',im.poor],['r',D.nd-im.better-im.average-im.poor]]),
 hap:bar([['c',hn(o=>earned(o)&&well(o))],['ok2',hn(o=>earned(o)&&!well(o))],['w2',hn(o=>!earned(o)&&well(o))],['p',hn(o=>!earned(o)&&!well(o))]])}}
/* How to use: 7 short steps in one sheet. All cards share one grid cell, so the card keeps the height of the
   longest step and the buttons never jump. Back / Next, dots, swipe; the last step's button closes the sheet. */
const GIC=['user','clock','track','smile','lock','cal','insights'],GN=GIC.length;let gI=0;
function guide(i){gI=Math.max(0,Math.min(GN-1,i));const s=$('#sheet');
 if(s.dataset.k!=='guide'||!s.classList.contains('on')||!$('.gstack',s)){openSheet(`<div class="gtop"><h3>${t('guide')}</h3><span class="gcount" aria-live="polite"></span></div>
<div class="gstack">${GIC.map((ic,j)=>`<div class="gcard" data-g="${j}"><span class="gic">${svg(ic)}</span><h4>${t('g'+(j+1)+'h')}</h4><p>${t('g'+(j+1)+'p')}</p></div>`).join('')}</div>
<div class="gdots" aria-hidden="true">${GIC.map(()=>'<i></i>').join('')}</div>
<div class="gnav"><button class="btn ghost" data-a="gGo" data-v="-1">${t('gBack')}</button><button class="btn pri" data-a="gGo" data-v="1"></button></div>`);s.dataset.k='guide';
  const st=$('.gstack',s);let x0=null;st.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
  st.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50)guide(gI+(dx<0?1:-1))})}
 $$('.gcard',s).forEach((c,j)=>{c.classList.toggle('on',j===gI);c.setAttribute('aria-hidden',j!==gI)});
 $$('.gdots i',s).forEach((d,j)=>d.classList.toggle('on',j===gI));
 $('.gcount',s).textContent=`${gI+1} / ${GN}`;$('.gcount',s).setAttribute('aria-label',tf('gStep',{n:gI+1,t:GN}));
 const bk=$('[data-v="-1"]',s),nx=$('[data-v="1"]',s);bk.disabled=gI===0;nx.textContent=gI===GN-1?t('gDone'):t('gNext');nx.dataset.last=gI===GN-1?'1':''}
/* ---------- Events ---------- */
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v;
switch(a){
case'lang':DB.settings.lang=v;store();redraw();break;
case'cp':{const f=$('#cpForm');f.classList.toggle('open');if(f.classList.contains('open'))setTimeout(()=>$('#pname').focus(),350);break}
case'create':createProfile();break;
case'cpCancel':{$('#cpForm').classList.remove('open');$('#pname').value='';$('#pgender').value='';$('#cpErr').textContent='';$('#welcome [data-a=cp]').focus();break}
case'login':login(b.dataset.id);break;
case'tab':go(v);break;

case'ans':{if(saved()||tR().includes(b.dataset.p))break;const D=draft(),x=D.p[b.dataset.p],f=b.dataset.f;x[f]=f==='motive'?v:v==='1';if(f==='prayed'&&!x.prayed){x.motive=null;x.manner=null}store();sync();break}
case'rstart':{if(saved()||restNow()||P().gender!=='female')break;restSheet('rsGo','rStartQ');break}
case'rsGo':{const i=+v;if(saved()||restNow()||!(i>=0&&i<5))break;RP().push({s:dk(),sp:i,e:null,ep:null});restSync();store();closeSheet();vTrack();break}
case'rend':{const r=restNow();if(!r||r.e||r.s===dk())break;restSheet('reGo','rEndQ');break}
case'reGo':{const r=restNow(),i=+v;if(!r||r.e||r.s===dk()||saved()||!(i>=0&&i<5))break;r.e=dk();r.ep=i;restSync();store();closeSheet();vTrack();break}
case'rcont':{const r=restNow();if(r&&!r.e){r.ack=dk();store();vTrack()}break}
case'rundo':{const r=restNow();if(!r||saved())break;if(r.e===dk()){r.e=null;r.ep=null}else if(r.s===dk())RP().splice(RP().indexOf(r),1);else break;restSync();store();vTrack();break}
case'imp':{if(saved())break;const D=draft();D.impact=v;store();sync();break}
case'hap':{if(saved())break;if(!HAP.includes(v))break;const D=draft();D.hap=v;store();sync();break}
case'save':confirmSheet(t('saveT'),t('saveM'),t('save'),'saveYes');break;
case'saveYes':doSave();break;
case'close':closeSheet();break;
case'guide':guide(0);break;
case'gGo':if(v==='1'&&b.dataset.last)closeSheet();else guide(gI+(+v));break;
case'psel':progSel(v);break;
case'wk':stepWk(+v);break;
case'pex':{const c=b.closest('.pc');if(c&&c.classList.contains('done')&&c.classList.contains('s-yes')){c.classList.toggle('exp');sync(curD())}break}
case'sw':showWelcome();break;
case'editN':editSheet();break;
case'editSave':{const n=$('#nn').value.trim().replace(/\s+/g,' '),e=$('#nerr');e.textContent=!n?t('eName'):dupe(n,S.pid)?t('eDup'):'';if(e.textContent)break;P().name=n;store();closeSheet();go('profile',false);break}
case'dDel':confirmSheet(t('dDel'),t('clrQ'),t('clrB'),'clrYes',true);break;
case'clrYes':DB.trackingData[S.pid]={};delete DB.drafts[S.pid];store();closeSheet();go('profile',false);break;
case'del':confirmSheet(t('del'),t('delQ'),t('delB'),'delYes',true);break;
case'delYes':{const id=S.pid;delete DB.profiles[id];delete DB.trackingData[id];delete DB.drafts[id];store();showWelcome();break}
case'theme':DB.settings.theme=v;store();applyTheme();break;
case'pdf':pdfSheet();break;   /* from Insights: this profile's report */
case'pdfGo':pdfGo();break;
case'pdfMode':pdfMode(v);break;
case'exp':doExport();break;
case'impPick':{const f=$('#impF');f.value='';f.click();break}
case'impP':impAsk(b.dataset.id);break;
case'impGo':{if(!pendImp||!pendImp.pick)break;const r=mergeInto(pendImp);pendImp=null;closeSheet();go(S.tab,false);toast(tf('impDone',{d:r.nd,u:r.up}));break}}});
document.addEventListener('input',e=>{if(!e.target.classList||!e.target.classList.contains('wkR'))return;$('#view').classList.add('drag');const w=maxWk()-(+e.target.value);if(w!==(S.wk||0)){S.wk=w;S.sel=null;drawCharts()}else updNav()});
document.addEventListener('change',e=>{if(e.target.classList&&e.target.classList.contains('wkR'))$('#view').classList.remove('drag')});
$('#scrim').addEventListener('click',()=>closeSheet());
$('#impF').addEventListener('change',e=>importFile(e.target.files&&e.target.files[0]));
document.addEventListener('change',e=>{const id=e.target.id;if(id==='pdfA'||id==='pdfB')$('#pdfE').textContent=''});
/* presentation: app bar gains a hairline once content scrolls under it */

document.addEventListener('keydown',e=>{if(e.target.matches&&e.target.matches('[data-a=pex]')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.target.click();return}if(!sheetOpen)return;if(e.key==='Escape')return closeSheet();
if(e.key==='Tab'){const f=$$('input,button',$('#sheet')).filter(x=>!x.disabled);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
window.addEventListener('popstate',e=>{if(sheetOpen){closeSheet(true);return}if(S.pid)go((e.state&&e.state.tab)||'track',false)});
/* Re-evaluate the 9 PM – midnight window while the app stays open */
let was=isOpen(),wasD=dk();
const tick=()=>{if(!S.pid||S.tab!=='track')return;const o=isOpen(),d=dk();if(o!==was||d!==wasD){was=o;wasD=d;closeSheet(true);vTrack()}};
setInterval(tick,15000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
/* If the data changes in another tab (another app tab, or seed.html), reload so this tab never overwrites it with an old copy */
window.addEventListener('storage',e=>{if(e.key===K||e.key===null)location.reload()});
/* ---------- Boot ---------- */
history.replaceState({tab:'track'},'');
applyTheme();lang();plist();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
setTimeout(()=>{$('#splash').classList.add('out');if(!S.pid)$('#welcome').hidden=false;setTimeout(()=>$('#splash').remove(),700)},1800);
