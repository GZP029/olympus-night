// What the oracle at Delphi has to say: sayings of the Greek philosophers.

type Saying = { text: string; who: string; greek?: string }

const SAYINGS: Saying[] = [
  { greek: 'Γνῶθι σεαυτόν', text: 'Conócete a ti mismo.', who: 'Inscripción del templo de Apolo en Delfos' },
  { greek: 'Μηδὲν ἄγαν', text: 'Nada en exceso.', who: 'Inscripción del templo de Apolo en Delfos' },
  { greek: 'ἦθος ἀνθρώπῳ δαίμων', text: 'El carácter de un hombre es su destino.', who: 'Heráclito' },
  { text: 'Nadie se baña dos veces en el mismo río, porque ni el río ni el hombre son los mismos.', who: 'Heráclito (atribuido)' },
  { text: 'No son las cosas las que nos perturban, sino las opiniones que tenemos de ellas.', who: 'Epicteto, Enquiridión' },
  { text: 'Primero di qué quieres ser; después haz lo que tengas que hacer.', who: 'Epicteto, Disertaciones' },
  { text: 'Lo que impide la acción hace avanzar la acción. Lo que se interpone en el camino se convierte en el camino.', who: 'Marco Aurelio, Meditaciones' },
  { text: 'Una vida sin examen no merece ser vivida.', who: 'Sócrates, en la Apología de Platón' },
  { text: 'Lo que hay que aprender a hacer, lo aprendemos haciéndolo.', who: 'Aristóteles, Ética a Nicómaco' },
  { text: 'Dadme un punto de apoyo y moveré el mundo.', who: 'Arquímedes (atribuido)' },
  { text: 'Nada es suficiente para quien lo suficiente es poco.', who: 'Epicuro' },
  { text: 'Delante de la virtud, los dioses inmortales pusieron el sudor.', who: 'Hesíodo, Los trabajos y los días' },
]

function pick(question: string): Saying {
  if (question.trim() === '') {
    return SAYINGS[Math.floor(Math.random() * SAYINGS.length)]!
  }
  // The same question always draws the same answer, as an oracle should.
  let h = 0
  for (const ch of question.trim().toLowerCase()) {
    h = (h * 31 + ch.codePointAt(0)!) >>> 0
  }
  return SAYINGS[h % SAYINGS.length]!
}

export function consult(question: string): string {
  const s = pick(question)
  const head = question.trim() === '' ? 'ΜΑΝΤΕΙΟΝ · El oráculo habla' : `ΜΑΝΤΕΙΟΝ · A tu pregunta, «${question.trim()}», el oráculo responde`
  const greek = s.greek ? `${s.greek}\n` : ''
  return `${head}\n\n${greek}«${s.text}»\n— ${s.who}`
}
