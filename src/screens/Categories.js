import React from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  BackHandler,
  Dimensions, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { filteredKnotsSet, knotsGet } from '../actions/knots';
import { languageGet, languageSet } from '../actions/language';
import changeDimWidthHeight from '../actions/dimensions';
import categories from '../assets/categories';
import Category from '../components/Category';
import exit from '../components/Exit';
import ThumbIcon from '../components/Icons';
import rate, { check10Days } from '../components/Rate';
import theme from '../styles/theme';
import connectToDB from '../db';
import AlertAccess from '../utils/AlertAccess/AlertAccess';
import defaultLanguage from '../utils/DefaultLanguage/defaultLanguage';
import Spinner from '../components/Spinner/Spinner';
//import AdBanner from '../components/AdMob';
import * as ScreenOrientation from "expo-screen-orientation";

  class Categories extends React.Component {
  state = {
    height: 0,
    access: false,
    isLoading: true,
  };

  Accessed = async () => {
    const { langCode, setLanguage } = this.props;

    const functions = () => {
      defaultLanguage(setLanguage);
      AlertAccess(this.exitApp, langCode);
    };

    try {
      const value = await AsyncStorage.getItem('access');
      if (value !== 'true' || value === null) {
        functions();
      }
    } catch (e) {
      alert('Failed to fetch the data from storage');
    }
  };

  componentDidMount() {
    const {
      getKnots,
      getLanguage,
      navigation,
      langCode,
      handleOrientationChanges,
    } = this.props;

    BackHandler.addEventListener('hardwareBackPress', this.exitApp);
    Dimensions.addEventListener('change', handleOrientationChanges);
    ScreenOrientation.addOrientationChangeListener(
        (o) => {
          console.log('o.orientationInfo.orientation: ', o.orientationInfo.orientation);
          // alert(o.orientationInfo.orientation)
        }
    );
    this.checkOrientation();
    this.loadData();
    getLanguage();
    /*Set languages params*/
    navigation.setParams({
      langCode,
    });
  }

    checkOrientation = async () => {
      const orientation = await ScreenOrientation.getOrientationAsync();
      console.log("orientation", orientation);
    };

  componentWillUnmount() {
    const {
      handleOrientationChanges,
    } = this.props;
    BackHandler.removeEventListener('hardwareBackPress', this.exitApp);
    Dimensions.removeEventListener('change', handleOrientationChanges);
  }

  loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('alreadyLaunched');
      if (value === null) {
        await AsyncStorage.setItem('alreadyLaunched', 'true');
        await AsyncStorage.setItem('favoriteKnots', JSON.stringify([]));
      }

      check10Days(this.props.langCode);
      await connectToDB();
      await this.Accessed();
      await this.props.getKnots();

      this.setState({ isLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate(prevProps) {
    const { navigation, langCode } = this.props;

    if (prevProps.langCode !== langCode) {
      navigation.setParams({
        langCode,
      });
    }
  }

  exitApp = () => {
    const { langCode } = this.props;

    exit(langCode);

    return true;
  };


  filterKnots = (catCode) => {
      const { knots, getKnots } = this.props;
      getKnots()

    switch (catCode) {
      case 'all': {
        return knots;
      }
      case 'favorite': {
        return knots.filter(({ favorite }) => favorite === true);
      }
      default: {
        return knots.filter(({ knoten_typ }) => {
          const types = knoten_typ.split('_');

          return types.includes(catCode);
        });
      }
    }
  };

  render() {
    const {
      setFilteredKnots,
      navigation,
      langCode,
      isPortrait,
      dHeight,
      dWidth,
    } = this.props;
    const { height } = this.state;

    /*Show rate alert*/
    const Rate = () => rate(langCode);

    if (this.state.isLoading) {
      return <Spinner />;
    }
    return (
      <>
        <StatusBar />
        <ScrollView
          style={styles.container}
          stickyHeaderIndices={[0, 3, 13]}
          contentContainerStyle={styles.container}
        >
          {categories.map((category, i, arr) => {
            const { code, image } = category;
            const filteredKnots = this.filterKnots(code);
            const name = category[`name_${langCode}`];
            const type = category[`type_${langCode}`];

            return [
              (!arr[i - 1] || arr[i - 1][`type_${langCode}`] !== type) && (
                <View>
                  <Text
                    style={[
                      styles.type,
                      { paddingHorizontal: !isPortrait ? 50 : 10 },
                    ]}
                    key={code}
                  >
                    {type}
                  </Text>
                </View>
              ),
              <Category
                key={code}
                data={{
                  name,
                  image,
                  count: filteredKnots.length,
                }}
                onPress={() => {
                  setFilteredKnots(filteredKnots);
                  navigation.navigate('Knots', { title: name });
                }}
                isPortrait={isPortrait}
                height={dHeight}
                width={dWidth}
              />,
            ];
          })}
          {/*admob banner*/}
          {/*<AdBanner />*/}
        </ScrollView>
        <ThumbIcon onPress={Rate} style={{ bottom: height + 15 }} />
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    color: theme.text,
    backgroundColor: theme.background,
  },
  type: {
    ...theme.categoryTypeHeader,
    padding: 8,
    fontSize: 16,
  },
});

export const knotPropType = PropTypes.shape({
  knotennummer: PropTypes.string,
  knotenname_de: PropTypes.string,
  knotenname_eng: PropTypes.string,
  knotenname_esp: PropTypes.string,
  knotenname_ru: PropTypes.string,
  knotenname_fr: PropTypes.string,
  knotenname_it: PropTypes.string,
  knotenname_tuek: PropTypes.string,
  knotenbeschreibung_de: PropTypes.string,
  knotenbeschreibung_eng: PropTypes.string,
  knotenbeschreibung_esp: PropTypes.string,
  knotenbeschreibung_ru: PropTypes.string,
  knotenbeschreibung_fr:PropTypes.string,
  knotenbeschreibung_it: PropTypes.string,
  knotenbeschreibung_tuek: PropTypes.string,
  knoten_frameweite: PropTypes.string,
  knoten_framehoehe: PropTypes.string,
  knoten_frame_2d: PropTypes.string,
  knoten_frame_360: PropTypes.string,
  knoten_count_x_2d: PropTypes.string,
  knoten_count_y_2d: PropTypes.string,
  knoten_count_x_360: PropTypes.string,
  knoten_count_y_360: PropTypes.string,
  knotenbild2d: PropTypes.string,
  knotenbild360: PropTypes.string,
  knoten_typ: PropTypes.string,
  knoten_abok: PropTypes.string,
  favorite: PropTypes.bool,
});

Categories.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }),
  setFilteredKnots: PropTypes.func.isRequired,
  getKnots: PropTypes.func.isRequired,
  getLanguage: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  knots: PropTypes.arrayOf(knotPropType),
  langCode: PropTypes.string.isRequired,
  isPortrait: PropTypes.bool.isRequired,
  dHeight: PropTypes.number.isRequired,
  dWidth: PropTypes.number.isRequired,
  handleOrientationChanges: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  knots: { knots },
  language: { langCode },
  dimensions: { isPortrait, height, width },
}) => ({
  knots,
  langCode,
  isPortrait,
  dHeight: height,
  dWidth: width,
});

const mapDispatchToProps = (dispatch) => ({
  setFilteredKnots: (knots) => dispatch(filteredKnotsSet(knots)),
  getKnots: () => dispatch(knotsGet()),
  getLanguage: () => dispatch(languageGet()),
  handleOrientationChanges: () => dispatch(changeDimWidthHeight()),
  setLanguage: (code) => dispatch(languageSet(code)),
});

export default connect(mapStateToProps, mapDispatchToProps, null)(Categories);
