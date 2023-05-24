import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import { languageSet } from '../actions/language';
import { LanguageCategory } from '../components/Category';
import languages from '../assets/languages.json';
import { goBackSafe } from '../utils/GoBackSafe/GoBackSafe';
import theme from '../styles/theme';
//import AdBanner from '../components/AdMob';

const Language = React.memo(
  ({ setLanguage, langCode, navigation, isPortrait, height, width }) => (
    <>
      {/*Background color depending on phone theme*/}
      <ScrollView style={{ backgroundColor: theme.backgroundColor }}>
        {languages.map(({ name, code }) => (
          <LanguageCategory
            key={code}
            name={name}
            active={langCode === code}
            onPress={() => {
              setLanguage(code);
              goBackSafe(navigation);
            }}
            isPortrait={isPortrait}
            height={height}
            width={width}
          />
        ))}
          {/*admob banner*/}
          {/*<AdBanner />*/}
      </ScrollView>
    </>
  )
);

Language.propTypes = {
  setLanguage: PropTypes.func.isRequired,
  langCode: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }),
  isPortrait: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

const mapStateToProps = ({
  language: { langCode },
  dimensions: { isPortrait, height, width },
}) => ({
  langCode,
  isPortrait,
  height,
  width,
});

const mapDispatchToProps = (dispatch) => ({
  setLanguage: (code) => dispatch(languageSet(code)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Language);
