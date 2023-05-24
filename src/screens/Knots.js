import React from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import {
  FlatList,
  View,
  InteractionManager,
  StyleSheet,
  BackHandler,
  Text,
} from 'react-native';

import { KnotCategory } from '../components/Category';
import { knotSet } from '../actions/knots';
import { SearchIcon } from '../components/Icons';
import HeaderTitle from '../components/HeaderTitle';
import SearchBox from '../components/SearchBox';
import { knotPropType } from './Categories';
import knotPreviews from '../assets/knots';
import { results, search, noResult } from '../assets/staticLocalisation.json';
import theme from '../styles/theme';
import { goBackSafe } from '../utils/GoBackSafe/GoBackSafe';
import Spinner from '../components/Spinner/Spinner';
//import AdBanner from '../components/AdMob';
// import { showInterstitialAd } from '../components/AdMob';

class Knots extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      showSearchField: false,
      searchParam: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    InteractionManager.runAfterInteractions(() => {
      const { navigation } = this.props;

      navigation.setOptions({
        headerRight: () => (
          <View>
            <SearchIcon onPress={this.onSearch} />
          </View>
        ),
      });

      BackHandler.addEventListener('hardwareBackPress', this.handleBackEvent);
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackEvent);
  }

  handleBackEvent = async () => {
    /*Start spinner*/
    this.setState({ isLoading: true });
    const { navigation } = this.props;
    goBackSafe(navigation);
    // showInterstitialAd();
    /*End spinner*/
    this.setState({ isLoading: false });
    return true;
  };

  onSearch = () => {
    const { navigation, langCode } = this.props;

    this.setState({
      showSearchField: true,
    });
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle title={results[`name_${langCode}`]}>
          <SearchBox
            changeSearchParam={this.changeSearchParam}
            endEditing={() => this.setState({ showSearchField: false })}
            placeholder={search[`name_${langCode}`]}
          />
        </HeaderTitle>
      ),
    });
  };

  renderItem = ({ item }) => {
    const {
      navigation: { navigate },
      setKnot,
      langCode,
      isPortrait,
      dHeight,
      dWidth,
    } = this.props;
    const name = item[`knotenname_${langCode}`];
    const preview = knotPreviews.find(
      ({ knotennummer }) => knotennummer === +item.knotennummer
    );
    const { imagePreview } = preview;
    const KnotCategoryOnPress = () => {
      setKnot(item);
      return navigate('Knot', {
        title: name.split('_')[0],
        reverse: item.favorite,
      });
    };

    return (
      <KnotCategory
        data={{
          name,
          image: imagePreview,
        }}
        onPress={KnotCategoryOnPress}
        isPortrait={isPortrait}
        height={dHeight}
        width={dWidth}
      />
    );
  };

  changeSearchParam = (searchParam) => this.setState({ searchParam });

  filterKnots = () => {
    const { knots, langCode } = this.props;
    const { searchParam } = this.state;
    return knots.filter(
      (knot) => knot[`knotenname_${langCode}`].includes(searchParam) && knot
    );
  };

  render() {
    const { isMounted } = this.state;

    if (!isMounted) {
      return null;
    }
    return this.state.isLoading ? (
      <Spinner />
    ) : (
      <View style={styles.container}>
        <FlatList
          data={this.filterKnots()}
          legacyImplementation
          windowSize={15}
          keyExtractor={({ knotennummer }) => `${knotennummer}`}
          renderItem={this.renderItem}
        />
        {!this.filterKnots().length ? (
          <Text style={styles.noResult}>
            {noResult[`name_${this.props.langCode}`]}
          </Text>
        ) : null}

        {/*banner*/}
        {/*<AdBanner />*/}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  noResult: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#fff',
    flex: 1,
  },
});

Knots.propTypes = {
  knots: PropTypes.arrayOf(knotPropType).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  setKnot: PropTypes.func.isRequired,
  langCode: PropTypes.string.isRequired,
  isPortrait: PropTypes.bool.isRequired,
  dHeight: PropTypes.number.isRequired,
  dWidth: PropTypes.number.isRequired,
};

const mapStateToProps = ({
  knots: { filteredKnots },
  language: { langCode },
  dimensions: { isPortrait, height, width },
}) => ({
  knots: filteredKnots,
  langCode,
  isPortrait,
  dHeight: height,
  dWidth: width,
});

const mapDispatchToProps = (dispatch) => ({
  setKnot: (knot) => dispatch(knotSet(knot)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Knots);
