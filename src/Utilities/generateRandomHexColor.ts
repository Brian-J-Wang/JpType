export const generateRandomHexColor = () => {
  // Generate a random number between 0 and 16777215 (FFFFFF in decimal)
  // This covers all possible 6-digit hex colors.
  let color = Math.floor(Math.random() * 16777215).toString(16);

  // Pad the hexadecimal string with leading zeros if necessary
  // to ensure it's always 6 digits long.
  while (color.length < 6) {
    color = "0" + color;
  }

  // Prepend '#' to form a valid hex color code.
  return "#" + color;
};
