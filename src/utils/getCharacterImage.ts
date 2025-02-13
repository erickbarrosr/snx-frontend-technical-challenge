export const getCharacterImage = (url: string): string => {
  const id = url.match(/\/([0-9]+)\/$/)?.[1];

  return id
    ? `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`
    : "https://starwars-visualguide.com/assets/img/placeholder.jpg";
};
