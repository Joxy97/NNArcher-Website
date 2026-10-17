// Descriptions of the actual portfolio images, in gallery order.
// Locations are omitted when the photograph's location is not confirmed.
const descriptions = {
  vencanja: [
    ["Mladenci u zagrljaju na stazi ispod drveća", "Newlyweds embracing on a path beneath the trees"],
    ["Mladenci na unutrašnjem stepeništu sa ukrasnom ogradom", "Newlyweds on an indoor staircase with an ornate railing"],
    ["Blizak portret mladenaca ispod svadbenog vela", "Close portrait of newlyweds beneath a wedding veil"],
    ["Mladoženja ljubi mladu ispred zgrade sa tornjem", "Groom kissing the bride outside a building with a tower"],
    ["Nasmejani mladenci pod podignutim velom", "Laughing newlyweds beneath a lifted veil"],
    ["Mladenci plešu u zagrljaju ispred zelenila", "Newlyweds dancing in an embrace against green foliage"],
    ["Portret mladoženje i mlade u toplom svetlu ispod vela", "Portrait of a bride and groom in warm light beneath a veil"],
    ["Crno-beli detalj zagrljaja mladenaca", "Black-and-white detail of a bride and groom embracing"],
    ["Mladenci se naginju jedno prema drugom na stepeništu", "Newlyweds leaning towards each other on a staircase"],
    ["Mladenci se drže za ruke dok trče stazom", "Newlyweds holding hands as they run along a path"],
    ["Mladoženja i mlada na svečanom stepeništu", "Bride and groom on an ornate staircase"],
    ["Mladenci se ljube ispod vela na stazi u parku", "Newlyweds kissing beneath a veil on a park path"],
  ],
  poslovne: [
    ["Poslovni portret žene u belom odelu sa beležnicom", "Business portrait of a woman in a white suit with a notebook"],
    ["Žena u belom odelu sedi u svetloj kancelariji", "Woman in a white suit seated in a bright office"],
    ["Poslovni portret žene sa fasciklom ispred zelenog zida", "Business portrait of a woman holding a folder against a green wall"],
    ["Razgovor u kancelariji sa ženom u belom odelu", "Office conversation with a woman in a white suit"],
    ["Portret žene u crnom sakou ispred neutralnog zida", "Portrait of a woman in a black blazer against a neutral wall"],
    ["Modni portret žene u sakou sa crnom rukavicom", "Fashion portrait of a woman in a blazer wearing a black glove"],
    ["Žena u crnom sakou čita modne novine", "Woman in a black blazer reading a fashion newspaper"],
    ["Stilizovani portret žene sa čašom i crnim rukavicama", "Styled portrait of a woman with a glass and black gloves"],
    ["Detalj ruke koja piše beleške tokom razgovora", "Close-up of a hand taking notes during a conversation"],
    ["Kutija sa vizitkartama na staklenom kancelarijskom stolu", "Business card box on a glass office table"],
    ["Knjiga, kartice i pribor raspoređeni na radnom stolu", "Book, cards and supplies arranged on a work table"],
    ["Detalj staklenog stola i ukrasne lampe u kancelariji", "Detail of a glass table and decorative office lamp"],
    ["Žena u crnom sakou čita modne novine", "Woman in a black blazer reading a fashion newspaper"],
    ["Svetla kancelarija sa foteljama, biljkom i umetničkom slikom", "Bright office with armchairs, a plant and artwork"],
    ["Knjiga, kartice i pribor raspoređeni na radnom stolu", "Book, cards and supplies arranged on a work table"],
    ["Dve fotelje ispod polica i uramljenih slika u kancelariji", "Two armchairs beneath shelves and framed pictures in an office"],
  ],
  portreti: [
    ["Žena posmatra izložbu u muzeju", "Woman looking at a museum exhibition"],
    ["Muškarac hoda preko kamenitog terena", "Man walking across rocky terrain"],
    ["Prolaznici na šetalištu pored istorijske zgrade", "People walking beside a historic building"],
    ["Muškarac sa gitarom u parku u popodnevnom svetlu", "Man with a guitar in a park in afternoon light"],
    ["Žena čita u fotelji pored podne lampe", "Woman reading in an armchair beside a floor lamp"],
    ["Spontan trenutak tokom igre kuglanja", "A candid moment during a bowling game"],
    ["Muškarac sedi među zelenim sedištima amfiteatra", "Man seated among green amphitheatre seats"],
    ["Dve osobe ispod krošnje drveta pri zalasku sunca", "Two people beneath a tree at sunset"],
    ["Nasmejana žena sedi na travi u hladovini", "Smiling woman sitting on grass in the shade"],
    ["Putnici odmaraju na kamenim stepenicama pored drveta", "Travellers resting on stone steps beside a tree"],
    ["Dvoje ljudi kroz crveni okvir prozora", "Two people seen through a red window frame"],
    ["Žena posmatra sliku u galeriji", "Woman looking at a painting in a gallery"],
    ["Osoba stoji uz ogradu šetališta pored vode", "Person standing by a waterfront railing"],
    ["Detalj ruku koje sviraju akustičnu gitaru", "Close-up of hands playing an acoustic guitar"],
    ["Usamljena figura na klupi na travnatom brežuljku", "A solitary figure on a bench on a grassy hill"],
    ["Ljudi sede i razgovaraju u enterijeru kafića", "People sitting and talking inside a café"],
  ],
  proslave: [
    ["Portret muškarca u svečanom odelu sa leptir-mašnom", "Portrait of a man in formalwear with a bow tie"],
    ["Žena u tamnoj svečanoj haljini pored kamenog zida", "Woman in a dark formal dress beside a stone wall"],
    ["Portret žene u ružičastoj haljini uz zavese", "Portrait of a woman in a pink dress beside curtains"],
    ["Žena u ružičastoj svečanoj haljini na otvorenom", "Woman in a pink formal dress outdoors"],
    ["Žena u beloj haljini razgleda album na sofi", "Woman in a white dress looking through an album on a sofa"],
    ["Žena u beloj haljini odmara na sofi pored prozora", "Woman in a white dress reclining on a sofa beside a window"],
    ["Portret žene u beloj haljini u svetlom enterijeru", "Portrait of a woman in a white dress in a bright interior"],
    ["Žena u beloj haljini podiže ruke prema svetlu prozora", "Woman in a white dress raising her hands towards window light"],
    ["Detalj čipkaste haljine i otvorenog albuma na sofi", "Detail of a lace dress and an open album on a sofa"],
    ["Žena u beloj haljini na sofi u prirodnom svetlu", "Woman in a white dress on a sofa in natural light"],
    ["Žena u beloj haljini i njen odraz u ogledalu", "Woman in a white dress and her reflection in a mirror"],
    ["Portret žene u čipkastoj haljini kraj zavese", "Portrait of a woman in a lace dress beside a curtain"],
    ["Žena u svečanoj haljini pravi selfi telefonom", "Woman in a formal dress taking a phone selfie"],
    ["Žena u ružičastoj haljini drži buket cveća", "Woman in a pink dress holding a bouquet"],
    ["Detalji proslave: cipele, torbica i nakit", "Celebration details: shoes, a handbag and jewellery"],
    ["Ruke sa ukrašenim noktima drže buket belih ljiljana", "Hands with decorated nails holding white lilies"],
  ],
};

export function createImageDescriptions(content, language) {
  const map = new Map();
  for (const gallery of content.galleries) {
    if (gallery.images.length !== descriptions[gallery.id]?.length)
      throw new Error(`Image descriptions need updating for ${gallery.id}`);
    gallery.images.forEach((id, index) => map.set(id, descriptions[gallery.id][index][language === "sr" ? 0 : 1]));
  }
  return (id, fallback = "") => map.get(id) || fallback;
}
