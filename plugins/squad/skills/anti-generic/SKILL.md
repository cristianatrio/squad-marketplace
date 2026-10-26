---
name: anti-generic
description: Reglas de dirección creativa para que una web o app nueva no parezca hecha con IA. Concepto propio (mundo, elemento firma, tipografía y paleta con carácter), lista de patrones genéricos prohibidos y guía para implementar fiel al diseño. Usar al diseñar o construir UI nueva, o cuando el usuario pide algo "distinto", "no genérico" o "que no parezca IA".
---

# Nada genérico: reglas de dirección creativa

Lo que construye el squad no puede parecer "hecho con IA". La prueba: **si le sacás el logo, ¿se nota de qué producto es?** Si podría ser el primer template de una búsqueda, está mal.

Si la marca ya tiene identidad o design system, se respeta y se extiende. Estas reglas aplican a cada decisión nueva.

## 1. Concepto antes que pantallas

Antes de diseñar o codear UI nueva, definí en `.squad/design.md`:

1. **Mundo**: el universo visual del que sale el producto, sacado de su rubro, su usuario y su lugar concretos. Ejemplos: una app de cosecha que toma el lenguaje de las etiquetas de cajón y la pizarra de feria; una fintech para kioscos que toma el ticket térmico y el cuaderno de fiado. "Moderno, limpio, minimalista" no es un concepto.
2. **Elemento firma**: una sola cosa memorable que nadie confundiría con un template: una interacción, un layout, un tratamiento tipográfico o una forma propia de mostrar el dato central. No es un pulido opcional: es parte del alcance.
3. **Tipografía con carácter**: una display con personalidad más una de texto bien legible. Inter, Roboto, Poppins, Montserrat, Open Sans, Lato o la fuente del sistema solo si el concepto lo justifica por escrito.
4. **Paleta derivada del concepto**: cada color con nombre según su origen ("tinta de sello", "cartón kraft"), no según la escala de Tailwind. Un acento, usado con disciplina.
5. **Composición**: la grilla sirve al contenido. Rompela donde el contenido lo pida: asimetría, contraste de escala, densidad.
6. **Copy real**: textos del dominio, en la voz del producto y con datos verosímiles. Nada de lorem ipsum.

## 2. Prohibido por defecto (las marcas de la IA)

- Degradés violeta o índigo hacia rosa o azul, blobs, orbes difuminados, glassmorphism, neón sobre negro.
- Hero centrado con titular genérico + subtítulo + dos botones ("Empezar" / "Saber más").
- Filas de 3 o 4 cards iguales con un ícono en un cuadradito redondeado.
- `rounded-2xl` y sombra suave en todo. shadcn, Material o Bootstrap sin intervenir.
- Emojis como íconos; íconos dentro de círculos pastel.
- Ilustraciones 3D isométricas o de stock, franjas de "confían en nosotros" con logos inventados, testimonios falsos.
- Dashboard por defecto (sidebar + 4 KPI cards + gráfico de líneas) sin haber pensado qué decisión toma el usuario ahí.
- Copy de IA: "Revolucioná", "Potenciá", "Descubrí", "sin esfuerzo", "todo en uno", "llevá tu X al siguiente nivel", "seamless", "unlock", "empower", "elevate".

Si usás algo de esta lista, justificalo por escrito en `.squad/design.md` desde el concepto.

## 3. Lo distinto no puede ser confuso

- Accesibilidad (contraste AA, foco, tamaños táctiles) y convenciones de plataforma (navegación, back, formularios) le ganan a la originalidad en las interacciones críticas.
- La identidad va en tipografía, color, composición, motion, copy y el elemento firma, no en reinventar cómo funciona un formulario.
- En mobile se aplica el mismo concepto respetando HIG y Material, no un iOS por defecto con otro color.

## 4. Para quien implementa

- Usá exactamente las fuentes, tokens y composición de `.squad/design.md`. No los reemplaces por los defaults del framework.
- No agregues degradés, sombras, radios ni íconos que no estén en el diseño.
- Lo que no esté especificado se decide desde el concepto, no desde el default de la librería.
- El elemento firma tiene que quedar funcionando. Si no llegás, marcalo como ⚠️, no lo saques.
