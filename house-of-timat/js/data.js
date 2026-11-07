const COLORS = {Wine:'#5a1f2b',Ivory:'#e6dccb',Sand:'#c2a27a',Noir:'#221a17',Sage:'#7d8a6b',Rose:'#c98f8f'};
const SHAPES = {
  dress:'M82 40h36l8 60 38 140H36l38-140z',
  top:'M72 40h56l40 46-20 20-15-12v118H67V94l-15 12-20-20z',
  trousers:'M66 40h68l12 200h-38l-8-120-8 120H54z'
};
const SZ = ['XS','S','M','L','XL'];
const PRODUCTS = [
 {id:'p1',name:'Aso Wine Gown',cat:'Dresses',price:185000,shape:'dress',colors:['Wine','Noir','Ivory'],sizes:SZ,desc:'A floor-length gown in structured crepe with a sculpted waist and a hand-finished hem.'},
 {id:'p2',name:'Ivory Slip Dress',cat:'Dresses',price:220000,shape:'dress',colors:['Ivory','Sand','Rose'],sizes:SZ,desc:'Bias-cut satin that skims the body. Made for bridal events and evening occasions.'},
 {id:'p3',name:'Sage Wrap Dress',cat:'Dresses',price:98000,shape:'dress',colors:['Sage','Noir','Sand'],sizes:SZ,desc:'A breathable wrap dress with adjustable ties, easy to wear from day to night.'},
 {id:'p4',name:'Timat Corset Top',cat:'Tops',price:65000,shape:'top',colors:['Noir','Wine','Ivory'],sizes:SZ,desc:'Boned and lined for a clean shape. Pairs with our wide trousers or a skirt.'},
 {id:'p5',name:'Silk Bow Blouse',cat:'Tops',price:72000,shape:'top',colors:['Ivory','Rose','Sage'],sizes:SZ,desc:'Fluid silk blouse with a soft tie neck and pearl buttons at the cuff.'},
 {id:'p6',name:'Tailored Wide Trousers',cat:'Trousers',price:85000,shape:'trousers',colors:['Noir','Sand','Sage'],sizes:SZ,desc:'High-waisted, fully lined trousers with a sharp crease and a relaxed leg.'},
 {id:'p7',name:'Pleated Palazzo',cat:'Trousers',price:78000,shape:'trousers',colors:['Wine','Ivory','Noir'],sizes:SZ,desc:'Wide pleated trousers in a fluid fabric that moves as you walk.'},
 {id:'p8',name:'Lace Iro & Buba Set',cat:'Native sets',price:160000,shape:'top',colors:['Wine','Sand','Sage'],sizes:SZ,desc:'A modern take on iro and buba in French lace, with a matching wrapper.'}
];
const TESTIMONIALS = [
 {n:'Adaeze O.',c:'Lagos',s:5,t:'The gown fitted perfectly after one adjustment. I received compliments all evening.'},
 {n:'Funke A.',c:'Abuja',s:5,t:'I sent my measurements and design notes, and the final piece was exactly what I pictured.'},
 {n:'Chioma E.',c:'Port Harcourt',s:4,t:'Beautiful finishing and fabric. Delivery took a little longer than I hoped, but it was worth it.'}
];
