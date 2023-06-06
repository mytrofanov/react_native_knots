import { Appearance } from 'react-native';

/*Dark app theme*/
const darkTheme = {
  background: '#344955',
  backgroundColor: '#222',
  navigationBackground: '#232F34',
  text: '#fff',
  secondaryText: '#8f8f8f',
  categorySelect: '#1f5c6e',

  knotBackground: '#222',
  knotInfoTitle: '#616161',
  knotInfoText: '#aeaeae',
  knotAttention: 'red',
  knotAttentionText: 'salmon',

  knotFooter: {
    backgroundColor: '#232F34',
    borderTopColor: '#616161',
  },
  categoryTypeHeader: {
    backgroundColor: '#07575b',
    color: '#fff',
  },
  category: {
    borderTopColor: '#4c4c4c',
    borderBottomColor: '#161616',
  },
  barStyle: {
    background: '#344955',
    text: '#fff',
  }
};

/*Light app theme*/
const lightTheme = {
  background: '#c4dfe6',
  backgroundColor: '#c4dfe6',
  navigationBackground: '#003b46',

  text: '#363636',
  secondaryText: '#8f8f8f',
  categorySelect: '#10a5ad',

  knotBackground: '#c4dfe6',
  knotInfoTitle: '#363636',
  knotInfoText: '#444',

  knotAttention: 'red',
  knotAttentionText: 'salmon',

  knotFooter: {
    backgroundColor: '#003b46',
    borderTopColor: '#616161',
  },
  categoryTypeHeader: {
    backgroundColor: '#07575b',
    color: '#fff',
  },
  category: {
    borderTopColor: '#98acf8',
    borderBottomColor: '#98acf8',
  },
  barStyle: {
    backgroundColor: '#c4dfe6',
    text: "dark-content"
  }
};

export default Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;
