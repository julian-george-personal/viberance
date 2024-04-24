## Viberance

Welcome to my midterm project for Dartmouth's MUS 16.01! It's simple: viberance converts chords to colors. Built with `react-three-fiber`, this 3D visualization is built to be simple and vibrant. The generated colors begin with the bass note, with each tone getting its own hue. Then, as you add more intervals onto the bass note, the hue, saturation, and brightness of the color change. Intervals within the same major key as the bass will generally increase brightness and saturation, whereas intervals to non-diatonic tones will often bring the hue towards the key that the interval suggests.

To use this, just plug in a MIDI keyboard, give your browser permissions, and start playing! This site doesn't create sound, so combine it with another app (a DAW or an online MIDI piano) to bring the sounds and visuals together.

### Building

1. Ensure npm, nodejs, and yarn are installed
2. Run `yarn` to install all packages
3. Run `yarn start` to use

### Deploying

1. Run `yarn build`
2. The compiled static site will build to `./public`
