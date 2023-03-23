export const randomColorPalette = [
  '#2F97C1',
  '#15E6CD',
  '#0CF574',
  '#C9F0FF',
  '#D67129',
  '#E4C332',
  '#F28123',
  '#D34E24',
  '#FDB833',
  '#FFE3DC',
  '#5FB0B7',
  '#DE369D',
  '#4392F1',
  '#87D868',
  '#E29C22',
  '#EE8434',
  '#C95D63',
  '#90D948',
  '#66E4F2',
  '#7343D9',
  '#F2B807',
];

export function getRandomColor() {
  return randomColorPalette[
    Math.floor(Math.random() * randomColorPalette.length)
  ];
}
