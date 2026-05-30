const pool = require('./db')

const mutants = [
  {
    id: 'wolverine', name: 'Wolverine', real_name: 'James Howlett',
    aliases: ['Logan', 'Weapon X'], mutant_class: 'Alpha',
    bio: 'Born in the 19th century, Logan is a gruff, cigar-smoking mutant with an indestructible adamantium skeleton and retractable claws. One of the greatest fighters on Earth.',
    power_types: ['Physical Mutation', 'Regeneration', 'Enhanced Senses'],
    affiliations: ['x-men', 'x-force', 'avengers'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'Incredible Hulk #181 (1974)', created_by: 'Roy Thomas, Len Wein',
    stats: {
      comics: { strength: 7, speed: 6, durability: 9, intelligence: 6, fighting: 10, healing: 10 },
      mcu: { strength: 8, speed: 7, durability: 8, intelligence: 6, fighting: 9, healing: 9 },
      fox: { strength: 7, speed: 6, durability: 9, intelligence: 5, fighting: 10, healing: 9 }
    },
    abilities: [
      { name: 'Regenerative Healing', desc: 'Recovers from almost any wound instantly' },
      { name: 'Adamantium Claws', desc: 'Six retractable claws, three per hand' },
      { name: 'Enhanced Senses', desc: 'Tracks by scent, superhuman hearing' },
      { name: 'Extended Lifespan', desc: 'Slowed aging, active since the 1800s' }
    ],
    related: ['x-23', 'sabretooth', 'professor-x'],
    color: '#f4a261',
    family: { father: 'thomas-logan', mother: 'elizabeth-howlett', children: ['x-23', 'daken'], siblings: [], spouse: null }
  },
  {
    id: 'magneto', name: 'Magneto', real_name: 'Erik Lehnsherr',
    aliases: ['Erik Magnus', 'The Master of Magnetism'], mutant_class: 'Omega',
    bio: 'A Holocaust survivor who became the most powerful mutant alive. Magneto walks the line between villain and reluctant hero.',
    power_types: ['Magnetism', 'Energy Projection', 'Force Fields'],
    affiliations: ['brotherhood', 'x-men'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'X-Men #1 (1963)', created_by: 'Stan Lee, Jack Kirby',
    stats: {
      comics: { strength: 8, speed: 7, durability: 8, intelligence: 9, fighting: 7, healing: 4 },
      mcu: { strength: 8, speed: 8, durability: 9, intelligence: 9, fighting: 7, healing: 4 },
      fox: { strength: 8, speed: 7, durability: 8, intelligence: 9, fighting: 7, healing: 4 }
    },
    abilities: [
      { name: 'Magnetic Control', desc: 'Manipulates all forms of magnetism and metal' },
      { name: 'Force Fields', desc: 'Generates impenetrable magnetic shields' },
      { name: 'Flight', desc: 'Levitates using Earth\'s magnetic field' },
      { name: 'EMP Pulse', desc: 'Disables all electronic devices in range' }
    ],
    related: ['wolverine', 'professor-x', 'mystique'],
    color: '#c77dff',
    family: { father: null, mother: null, children: ['quicksilver', 'scarlet-witch', 'polaris'], siblings: [], spouse: 'magda' }
  },
  {
    id: 'storm', name: 'Storm', real_name: 'Ororo Munroe',
    aliases: ['Goddess of Thunder', 'Wind Rider'], mutant_class: 'Omega',
    bio: 'Worshipped as a goddess in Kenya, Ororo Munroe can control all forms of weather. One of the most powerful X-Men and a natural leader.',
    power_types: ['Weather Control', 'Flight', 'Energy Projection'],
    affiliations: ['x-men'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'Giant-Size X-Men #1 (1975)', created_by: 'Len Wein, Dave Cockrum',
    stats: {
      comics: { strength: 6, speed: 8, durability: 7, intelligence: 8, fighting: 8, healing: 3 },
      mcu: { strength: 6, speed: 9, durability: 7, intelligence: 8, fighting: 8, healing: 3 },
      fox: { strength: 6, speed: 8, durability: 7, intelligence: 7, fighting: 7, healing: 3 }
    },
    abilities: [
      { name: 'Weather Manipulation', desc: 'Controls rain, lightning, wind and snow' },
      { name: 'Lightning Bolts', desc: 'Calls down devastating lightning strikes' },
      { name: 'Flight', desc: 'Rides wind currents at high speeds' },
      { name: 'Temperature Control', desc: 'Can freeze or superheat the air around her' }
    ],
    related: ['cyclops', 'wolverine', 'professor-x'],
    color: '#90e0ef',
    family: { father: 'david-munroe', mother: 'n-dare', children: [], siblings: [], spouse: 'black-panther' }
  },
  {
    id: 'cyclops', name: 'Cyclops', real_name: 'Scott Summers',
    aliases: ['Slim', 'One-Eye'], mutant_class: 'Alpha',
    bio: 'The field leader of the X-Men, Scott Summers constantly emits powerful optic blasts from his eyes, controllable only with special ruby quartz visors.',
    power_types: ['Energy Projection', 'Optic Blasts'],
    affiliations: ['x-men', 'x-force'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'X-Men #1 (1963)', created_by: 'Stan Lee, Jack Kirby',
    stats: {
      comics: { strength: 6, speed: 6, durability: 7, intelligence: 8, fighting: 9, healing: 2 },
      mcu: { strength: 6, speed: 6, durability: 7, intelligence: 8, fighting: 9, healing: 2 },
      fox: { strength: 6, speed: 6, durability: 7, intelligence: 7, fighting: 8, healing: 2 }
    },
    abilities: [
      { name: 'Optic Blasts', desc: 'Fires powerful force beams from his eyes' },
      { name: 'Tactical Genius', desc: 'Masterful battlefield strategist' },
      { name: 'Ruby Quartz Visor', desc: 'Allows precise control of his beams' },
      { name: 'Peak Human Fitness', desc: 'Trained combatant without powers' }
    ],
    related: ['jean-grey', 'wolverine', 'havok'],
    color: '#e63946',
    family: { father: 'corsair', mother: 'katherine-summers', children: ['cable', 'x-man'], siblings: ['havok', 'vulcan'], spouse: 'jean-grey' }
  },
  {
    id: 'jean-grey', name: 'Jean Grey', real_name: 'Jean Elaine Grey',
    aliases: ['Marvel Girl', 'Phoenix', 'Dark Phoenix'], mutant_class: 'Omega',
    bio: 'One of the most powerful telepaths and telekinetics alive, Jean Grey is also the host of the cosmic Phoenix Force.',
    power_types: ['Telepathy', 'Telekinesis', 'Cosmic Energy'],
    affiliations: ['x-men'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'X-Men #1 (1963)', created_by: 'Stan Lee, Jack Kirby',
    stats: {
      comics: { strength: 8, speed: 7, durability: 9, intelligence: 9, fighting: 7, healing: 5 },
      mcu: { strength: 9, speed: 8, durability: 9, intelligence: 9, fighting: 7, healing: 6 },
      fox: { strength: 8, speed: 7, durability: 9, intelligence: 9, fighting: 7, healing: 5 }
    },
    abilities: [
      { name: 'Telepathy', desc: 'Reads and controls minds across vast distances' },
      { name: 'Telekinesis', desc: 'Moves and shapes matter with her mind' },
      { name: 'Phoenix Force', desc: 'Channels near-infinite cosmic energy' },
      { name: 'Astral Projection', desc: 'Projects her consciousness across dimensions' }
    ],
    related: ['cyclops', 'professor-x', 'wolverine'],
    color: '#ff6b6b',
    family: { father: 'john-grey', mother: 'elaine-grey', children: ['cable', 'x-man'], siblings: ['sara-grey'], spouse: 'cyclops' }
  },
  {
    id: 'professor-x', name: 'Professor X', real_name: 'Charles Francis Xavier',
    aliases: ['Professor X', 'Onslaught'], mutant_class: 'Omega',
    bio: 'The world\'s most powerful telepath and founder of the X-Men, running a school to train young mutants.',
    power_types: ['Telepathy', 'Mind Control'],
    affiliations: ['x-men'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'X-Men #1 (1963)', created_by: 'Stan Lee, Jack Kirby',
    stats: {
      comics: { strength: 3, speed: 2, durability: 4, intelligence: 10, fighting: 4, healing: 2 },
      mcu: { strength: 3, speed: 2, durability: 4, intelligence: 10, fighting: 4, healing: 2 },
      fox: { strength: 3, speed: 2, durability: 4, intelligence: 10, fighting: 4, healing: 2 }
    },
    abilities: [
      { name: 'Telepathy', desc: 'Most powerful telepath on Earth' },
      { name: 'Mind Wipe', desc: 'Can erase or alter memories permanently' },
      { name: 'Cerebro Interface', desc: 'Amplifies his range to cover the whole planet' },
      { name: 'Astral Combat', desc: 'Battles enemies in the astral plane' }
    ],
    related: ['magneto', 'cyclops', 'jean-grey'],
    color: '#4cc9f0',
    family: { father: 'brian-xavier', mother: 'sharon-xavier', children: ['legion', 'david-haller'], siblings: ['juggernaut'], spouse: null }
  },
  {
    id: 'mystique', name: 'Mystique', real_name: 'Raven Darkhölme',
    aliases: ['Raven', 'Malleable'], mutant_class: 'Beta',
    bio: 'A shape-shifting mutant and master spy who can perfectly mimic any person\'s appearance and voice.',
    power_types: ['Shapeshifting', 'Physical Mutation'],
    affiliations: ['brotherhood', 'x-men'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'Ms. Marvel #16 (1978)', created_by: 'Chris Claremont, Dave Cockrum',
    stats: {
      comics: { strength: 6, speed: 7, durability: 6, intelligence: 8, fighting: 9, healing: 5 },
      mcu: { strength: 6, speed: 7, durability: 6, intelligence: 8, fighting: 9, healing: 5 },
      fox: { strength: 6, speed: 7, durability: 6, intelligence: 8, fighting: 9, healing: 5 }
    },
    abilities: [
      { name: 'Shapeshifting', desc: 'Perfectly copies any human\'s appearance' },
      { name: 'Voice Mimicry', desc: 'Replicates any voice flawlessly' },
      { name: 'Master Combatant', desc: 'Expert in multiple martial arts' },
      { name: 'Accelerated Healing', desc: 'Slower than Wolverine but above human' }
    ],
    related: ['magneto', 'wolverine', 'nightcrawler'],
    color: '#4895ef',
    family: { father: null, mother: null, children: ['nightcrawler', 'graydon-creed'], siblings: [], spouse: null }
  },
  {
    id: 'deadpool', name: 'Deadpool', real_name: 'Wade Wilson',
    aliases: ['Merc with a Mouth', 'Wade'], mutant_class: 'Beta',
    bio: 'A wise-cracking mercenary whose cancer was cured by a forced mutation that gave him Wolverine-level healing.',
    power_types: ['Regeneration', 'Physical Mutation'],
    affiliations: ['x-force', 'x-men'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'New Mutants #98 (1991)', created_by: 'Fabian Nicieza, Rob Liefeld',
    stats: {
      comics: { strength: 7, speed: 7, durability: 8, intelligence: 6, fighting: 9, healing: 10 },
      mcu: { strength: 7, speed: 7, durability: 8, intelligence: 6, fighting: 9, healing: 10 },
      fox: { strength: 7, speed: 7, durability: 8, intelligence: 6, fighting: 9, healing: 10 }
    },
    abilities: [
      { name: 'Regenerative Healing', desc: 'Regrows limbs; nearly impossible to kill' },
      { name: 'Fourth Wall Awareness', desc: 'Knows he is a fictional character' },
      { name: 'Expert Marksman', desc: 'Master of guns, swords, and improvised weapons' },
      { name: 'Unpredictability', desc: 'His insanity makes him impossible to read' }
    ],
    related: ['wolverine', 'cable', 'colossus'],
    color: '#e63946',
    family: { father: null, mother: null, children: ['ellie-camacho'], siblings: [], spouse: 'shiklah' }
  },
  {
    id: 'beast', name: 'Beast', real_name: 'Henry Philip McCoy',
    aliases: ['Hank', 'Dr. McCoy'], mutant_class: 'Beta',
    bio: 'A brilliant scientist and founding X-Man with superhuman agility and strength.',
    power_types: ['Physical Mutation', 'Enhanced Agility'],
    affiliations: ['x-men', 'avengers'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'X-Men #1 (1963)', created_by: 'Stan Lee, Jack Kirby',
    stats: {
      comics: { strength: 8, speed: 7, durability: 7, intelligence: 10, fighting: 8, healing: 3 },
      mcu: { strength: 8, speed: 7, durability: 7, intelligence: 10, fighting: 8, healing: 3 },
      fox: { strength: 8, speed: 7, durability: 7, intelligence: 9, fighting: 7, healing: 3 }
    },
    abilities: [
      { name: 'Superhuman Strength', desc: 'Can lift several tons with ease' },
      { name: 'Wall Crawling', desc: 'Climbs vertical surfaces with hands and feet' },
      { name: 'Scientific Genius', desc: 'PhD in biochemistry and genetics' },
      { name: 'Accelerated Healing', desc: 'Heals faster than ordinary humans' }
    ],
    related: ['professor-x', 'cyclops', 'jean-grey'],
    color: '#4361ee',
    family: { father: 'norton-mccoy', mother: 'edna-mccoy', children: [], siblings: [], spouse: null }
  },
  {
    id: 'nightcrawler', name: 'Nightcrawler', real_name: 'Kurt Wagner',
    aliases: ['The Incredible Nightcrawler', 'Fuzzy Elf'], mutant_class: 'Beta',
    bio: 'A deeply religious, swashbuckling German mutant with blue skin, a prehensile tail, and the ability to teleport anywhere he can see.',
    power_types: ['Teleportation', 'Physical Mutation'],
    affiliations: ['x-men'],
    universes: ['comics', 'fox', 'mcu'],
    first_appearance: 'Giant-Size X-Men #1 (1975)', created_by: 'Len Wein, Dave Cockrum',
    stats: {
      comics: { strength: 6, speed: 8, durability: 6, intelligence: 6, fighting: 8, healing: 2 },
      mcu: { strength: 6, speed: 9, durability: 6, intelligence: 6, fighting: 8, healing: 2 },
      fox: { strength: 6, speed: 8, durability: 6, intelligence: 6, fighting: 8, healing: 2 }
    },
    abilities: [
      { name: 'Teleportation', desc: 'Instantly teleports with a BAMF of smoke' },
      { name: 'Wall Crawling', desc: 'Sticks to any surface with hands, feet and tail' },
      { name: 'Prehensile Tail', desc: 'Strong tail acts as a third hand in combat' },
      { name: 'Camouflage', desc: 'Near-invisible in shadows due to blue skin' }
    ],
    related: ['wolverine', 'mystique', 'storm'],
    color: '#7209b7',
    family: { father: 'azazel', mother: 'mystique', children: [], siblings: ['graydon-creed'], spouse: null }
  }
]

const teams = [
  { id: 'x-men', name: 'X-Men', description: 'Professor X\'s team of mutant heroes fighting for peaceful coexistence', color: '#4cc9f0' },
  { id: 'brotherhood', name: 'Brotherhood of Mutants', description: 'Magneto\'s militant group fighting for mutant supremacy', color: '#c77dff' },
  { id: 'x-force', name: 'X-Force', description: 'The X-Men\'s black-ops strike team for darker missions', color: '#e63946' },
  { id: 'avengers', name: 'Avengers', description: 'Earth\'s Mightiest Heroes', color: '#ffd700' }
]

const powerTypes = [
  { id: 'telepathy', name: 'Telepathy', icon: '🧠', description: 'Reading and controlling minds' },
  { id: 'telekinesis', name: 'Telekinesis', icon: '✨', description: 'Moving objects with the mind' },
  { id: 'regeneration', name: 'Regeneration', icon: '💚', description: 'Accelerated healing and recovery' },
  { id: 'physical-mutation', name: 'Physical Mutation', icon: '💪', description: 'Enhanced physical attributes' },
  { id: 'energy-projection', name: 'Energy Projection', icon: '⚡', description: 'Generating and firing energy' },
  { id: 'magnetism', name: 'Magnetism', icon: '🔵', description: 'Control over magnetic fields' },
  { id: 'weather-control', name: 'Weather Control', icon: '🌩️', description: 'Manipulating weather and atmosphere' },
  { id: 'shapeshifting', name: 'Shapeshifting', icon: '🔄', description: 'Changing physical appearance' },
  { id: 'teleportation', name: 'Teleportation', icon: '💨', description: 'Instant movement through space' }
]

async function seed() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const m of mutants) {
      await client.query(`
        INSERT INTO mutants (id, name, real_name, aliases, mutant_class, bio, power_types, affiliations, universes, first_appearance, created_by, stats, abilities, related, color, family)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, bio=EXCLUDED.bio, stats=EXCLUDED.stats, family=EXCLUDED.family, updated_at=NOW()
      `, [m.id, m.name, m.real_name, m.aliases, m.mutant_class, m.bio, m.power_types, m.affiliations, m.universes, m.first_appearance, m.created_by, JSON.stringify(m.stats), JSON.stringify(m.abilities), m.related, m.color, JSON.stringify(m.family)])
    }
    for (const t of teams) {
      await client.query(`INSERT INTO teams (id, name, description, color) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`, [t.id, t.name, t.description, t.color])
    }
    for (const p of powerTypes) {
      await client.query(`INSERT INTO power_types (id, name, icon, description) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`, [p.id, p.name, p.icon, p.description])
    }
    await client.query('COMMIT')
    console.log('Seeded successfully')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
    pool.end()
  }
}

seed().catch(console.error)