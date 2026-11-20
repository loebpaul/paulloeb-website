const urls = {
  launch: 'https://launchdarkly.com/solutions/control-ai-agents/',
  drop: 'https://www.droptrack.com/',
  github: 'https://github.com/features/copilot',
  linkedin: 'https://www.linkedin.com/in/loebpaul/',
  ego: 'https://www.noegorecords.com/',
  dreams: 'https://www.velvetcircuits.com/',
  cats: 'https://soundcloud.com/reallycutecats',
  olderMusic: 'https://soundcloud.com/paulloebmusic',
  duets: 'https://www.youtube.com/playlist?list=PLVP9gqGdj2ds',
  boris: 'https://www.instagram.com/russian_boris/'
};
const noEgoDescription='I started an independent label to promote undiscovered dance/electronic artists.';
const roles = [
  {name:'LaunchDarkly',id:'launch',when:'2026–present',note:'Principal AI Product Manager. I work on how teams evaluate, release, and run AI in production.',link:urls.launch},
  {name:'GitHub / Microsoft',id:'github',when:'2021–2026',note:'Senior Product Manager for GitHub Copilot and developer tools.',link:urls.github},
  {name:'Flowspace',id:'flow',when:'2020–2021',note:'Senior Product Manager for warehousing and logistics.'},
  {name:'Ticketmaster / Live Nation',id:'ticket',when:'2020',note:'Lead Product Manager for the Ticketmaster mobile apps.'},
  {name:'Thrive Market',id:'thrive',when:'2019',note:'Senior Product Manager for an online organic grocery store.'},
  {name:'ZipRecruiter',id:'zip',when:'2017–2019',note:'Senior Product Manager, connecting job seekers and employers using AI matching.'},
  {name:'Ubiquiti Networks',id:'ubnt',when:'2015–2016',note:'Product Manager for UniFi Video security cameras.'},
  {name:'Beats by Dre / Apple',id:'apple',logo:'beats-red.png',when:'2014–2015',note:'I managed software engineering for Beats by Dre at Apple. Explore two products I worked on.',products:true},
  {name:'DropTrack',id:'drop',logo:'droptrack-2026-mark.png',when:'2016–present',note:'I founded DropTrack to help artists and labels get their music heard.',link:urls.drop},
  {name:'No Ego Records',id:'ego',when:'2010–present',note:noEgoDescription,link:urls.ego},
  {name:'OrderingApps',id:'order',logo:'orderingapps-icon.png',when:'2010–2012',note:'We built white-label apps for restaurants. Acquired in 2012.'},
  {name:'University of Southern California',id:'usc',logo:'usc-interlock.svg',when:'2005–2009',note:'I studied business, entrepreneurship, and music industry, and played trumpet in the Trojan Marching Band.'},
  {name:'Video Symphony',id:'symphony',when:'2009–2010',note:'I studied audio engineering and music production. Certified Pro Tools Expert.'}
];
const interviews = [
  {name:'AI Snacks',title:'Music, AI & the Future of Music Promotion',photo:'ai.jpg',link:'https://podcasts.apple.com/ie/podcast/84-music-ai-the-future-of-music-promotion-with-paul-loeb/id1742010072?i=1000777658083'},
  {name:'The Sounds Like Us',title:'Music promotion for independent artists',photo:'sounds.jpg',link:'https://shows.acast.com/sounds-like-us/episodes/paul-loeb-of-droptrack-how-droptrack-is-revolutionising-musi'},
  {name:'ElectroFans Pro Talk',title:'Getting releases to the right DJs and labels',photo:'electro.jpg',link:'https://www.electrofans.com/interview-droptrack/'},
  {name:'Phantom Electric Ghost',title:'Using AI to promote music',photo:'phantom.png',link:'https://www.droptrack.com/paul-loeb-on-phantom-electric-ghost-revolutionizing-music-promotion-with-ai/'}
];
const duets = [
  ['After the Gold Rush','Neil Young','05jQb5QpznM','duet-gold.avif'],
  ['Just the Way You Are','Billy Joel','vkymMmhGqYI','duet-billy.avif'],
  ['The Boxer','Simon & Garfunkel','v_yAIAGHZN0','duet-boxer.avif'],
  ['When I’m Sixty-Four','The Beatles','7Yh5y5fVDgU','duet-beatles.avif']
];
const countries = [
  ['United States',-98.58,39.83,840],['Mexico',-102.55,23.63,484],['Peru',-75.015,-10.08,604],
  ['Argentina',-64.55,-34.61,32],['Uruguay',-56.02,-32.83,858],['Israel',34.782,32.085,376],['UAE',54.38,24.47,784],
  ['Netherlands',5.30,52.14,528],['Spain',-3.72,40.42,724],['Taiwan',120.98,23.78,158],['Jamaica',-77.31,18.14,388],
  ['Portugal',-8.14,39.60,620],['Philippines',122.56,10.72,608],['Indonesia',110.42,-7.80,360],
  ['Germany',10.45,51.15,276],['Italy',12.49,41.90,380],['Black Rock City',-119.203,40.787,null]
];
const eclipses = ['Nashville, TN','Burnet, TX','Four Corners, AZ, CO, NM, UT','Roda de Berá, Spain'];
const patch = {
  launch:{title:'DropTrack → LaunchDarkly',note:'I use DropTrack to dogfood LaunchDarkly’s AgentControl on an application I build and operate.',label:'LaunchDarkly AI',link:urls.launch},
  github:{title:'DropTrack → GitHub',note:'We use GitHub at DropTrack. It’s also where I previously worked on Copilot and developer tools.',label:'GitHub Copilot',link:urls.github},
  ego:{title:'No Ego Records → DropTrack',note:'Promoting releases from my own label gave me the idea for DropTrack.',label:'No Ego Records',link:urls.ego}
};
