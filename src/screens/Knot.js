import React, { useCallback } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
  InteractionManager,
  Linking,
  Alert,
  TouchableOpacity, StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { knotPropType } from './Categories';
import {
  Icon360,
  PlayIcon,
  RotateIcon,
  ReRotateIcon,
  PauseIcon,
  KnotIcon,
  MirrorLeftIcon,
  MirrorRightIcon,
  RepeatIcon,
  LikeIcon,
} from '../components/Icons';
import Animation from '../components/Animation';
import KnotsSprites from '../assets/knots';
import types from '../assets/categories';
import {
  description,
  attention,
  attentionText,
  alias,
  strength,
} from '../assets/staticLocalisation.json';
import { knotLike } from '../actions/knots';
import theme from '../styles/theme';
import { goBackSafe } from '../utils/GoBackSafe/GoBackSafe';
// import { showInterstitialAd } from '../components/AdMob';

class Knot extends React.PureComponent {
  constructor(props) {
    super(props);
    const { knot } = props;
    const sprite = KnotsSprites.find(
      ({ knotennummer }) => knotennummer === +knot.knotennummer
    );
    const { image2d, image360 } = sprite;

    this.state = {
      isMounted: false,
      paused: false,
      rotated: false,
      is360: false,
      mirrored: false,
      showSpeed: false,
      isFinished: false,
      speed: 20,
      image2d,
      image360,
    };

    this.spinValue = new Animated.Value(0);
    this.mirrorValue = new Animated.Value(0);
  }

  componentDidMount() {
    const {
      navigation,
      knot: { favorite },
    } = this.props;

    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <LikeIcon onPress={this.like} reverse={favorite} />
        </View>
      ),
    });

    this.setState({ isMounted: true });
    InteractionManager.runAfterInteractions(() => {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackEvent);
      this.playAnimation();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { is360, speed } = this.state;
    const { height } = this.props;

    if (is360 !== prevState.is360 || height !== prevProps.height) {
      this.animation.changeView(() => this.setState({ paused: false }));
      this.animation.reset();
      this.animation.start(speed);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackEvent);
  }

  handleBackEvent = async () => {
    const { navigation } = this.props;
    goBackSafe(navigation);
    // showInterstitialAd();

    return true;
  };

  like = async () => {
    const {
      navigation,
      knot: { knotennummer, favorite },
      like,
    } = this.props;

    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <LikeIcon onPress={this.like} reverse={!favorite} />
        </View>
      ),
    });

    await like(knotennummer);
    this.setState({});
  };

  onEndAnimation = () => this.setState({ paused: true, isFinished: true });

  onSwipe = () => this.setState({ paused: true, isFinished: false });

  pauseAnimation = () => {
    this.setState({
      paused: true,
    });
    this.animation.stop();
  };

  playAnimation = () => {
    const { speed, isFinished } = this.state;

    if (isFinished) {
      this.animation.reset();
    }
    this.setState({
      paused: false,
      isFinished: false,
    });
    this.animation.start(speed);
  };

  changeSpeed = (speed) => {
    const { paused } = this.state;

    this.setState({ speed });
    if (!paused) {
      this.animation.start(speed);
    }
  };

  rotateImage = () => {
    const { rotated } = this.state;

    this.spinValue.setValue(rotated);
    Animated.timing(this.spinValue, {
      toValue: !rotated,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    this.setState({
      rotated: !rotated,
    });
  };

  mirrorImage = () => {
    const { mirrored } = this.state;

    this.mirrorValue.setValue(mirrored);
    Animated.timing(this.mirrorValue, {
      toValue: !mirrored,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    this.setState({
      mirrored: !mirrored,
    });
  };

  changeView = () => {
    const { is360 } = this.state;

    this.setState({
      is360: !is360,
      paused: false,
      isFinished: false,
    });
  };

  render() {
    const { knot, langCode, isPortrait, height, width } = this.props;
    const {
      knoten_frameweite,
      knoten_framehoehe,
      knoten_frame_2d,
      knoten_frame_360,
      knoten_count_x_2d,
      knoten_count_y_2d,
      knoten_count_x_360,
      knoten_count_y_360,
      knoten_abok,
      knotenwarnung_de,
    } = knot;
    const {
      isMounted,
      rotated,
      paused,
      isFinished,
      is360,
      mirrored,
      speed,
      showSpeed,
      image2d,
      image360,
    } = this.state;

    if (!isMounted) {
      return null;
    }

    const names = knot[`knotenname_${langCode}`].split('_');
    const currentTypes = types.filter(({ code }) =>
      knot.knoten_typ.includes(code)
    );

    const RotateData = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
      useNativeDriver: true,
    });
    const MirrorData = this.mirrorValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    const fontSize = width < 500 ? 16 : 28;
    const knotHeight = isPortrait ? height / 2.5 : height / 1.4;

    const OnSlidingComplete = () => this.setState({ showSpeed: false });
    const OnResponderStart = () => this.setState({ showSpeed: true });

    const OpenURLButton = ({ url, children }) => {
      const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
      }, [url]);

      return (
        <TouchableOpacity onPress={handlePress}>
          <Text style={[styles.infoText, { fontSize }]}>{children}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <>
        <StatusBar />
        <View
          style={[
            styles.container,
            { flexDirection: isPortrait ? 'column' : 'row' },
          ]}
        >
          <View
            style={[
              {
                flexDirection: isPortrait ? 'row' : 'row-reverse',
                width: isPortrait ? width : width / 2,
                alignItems: 'center',
              },
            ]}
          >
            <Animated.View
              style={{
                alignItems: 'center',
                transform: [{ rotate: RotateData }, { rotateY: MirrorData }],
                flexBasis: isPortrait ? '90%' : '80%',
              }}
            >
              <Animation
                ref={(ref) => {
                  this.animation = ref;
                }}
                height={knotHeight}
                source={is360 ? image360 : image2d}
                columns={is360 ? +knoten_count_x_360 : +knoten_count_x_2d}
                rows={is360 ? +knoten_count_y_360 : +knoten_count_y_2d}
                frameHeight={+knoten_framehoehe}
                frameWidth={+knoten_frameweite}
                onEndAnimation={this.onEndAnimation}
                onSwipe={this.onSwipe}
                loop={is360}
                frameCount={is360 ? +knoten_frame_360 : +knoten_frame_2d}
              />
            </Animated.View>
            <Slider
              style={[
                styles.slider,
                {
                  width: width,
                  marginLeft: isPortrait ? -knotHeight / 2.2 : 0,
                  marginRight: !isPortrait ? -knotHeight / 2.3 : 0,
                },
              ]}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={50}
              minimumTrackTintColor="#009688"
              maximumTrackTintColor="#009688"
              thumbTintColor="#00b8d4"
              onValueChange={this.changeSpeed}
              onSlidingComplete={OnSlidingComplete}
              onResponderStart={OnResponderStart}
            />
          </View>
          {showSpeed && <Text style={styles.speed}>Speed: {speed}</Text>}

          <ScrollView style={styles.description}>
            <Text style={[styles.infoText, { fontSize }]}>
              <Text style={[styles.infoTitle, { fontSize }]}>
                {description[`name_${langCode}`]}:{' '}
              </Text>
              {knot[`knotenbeschreibung_${langCode}`]}
            </Text>
            {knoten_abok !== null && (
              <Text style={[styles.infoTitle, { fontSize }]}>
                ABOK:{' '}
                <Text style={[styles.infoText, { fontSize }]}>
                  {knoten_abok}
                </Text>
              </Text>
            )}
            {knotenwarnung_de ? (
              <>
                <Text style={[styles.attention, { fontSize }]}>
                  {attention[`name_${langCode}`]}!
                </Text>
                <Text style={[styles.attentionText, { fontSize }]}>
                  {attentionText[`name_${langCode}`]}
                </Text>
              </>
            ) : null}
            <Text style={[styles.infoTitle, { fontSize }]}>
              {alias[`name_${langCode}`]}:{' '}
            </Text>
            {names.map((nm) => (
              <Text
                style={[styles.infoText, { paddingLeft: 10, fontSize }]}
                key={nm}
              >
                {' '}
                - {nm}
              </Text>
            ))}
            <Text style={[styles.infoTitle, { fontSize }]}>
              {strength[`name_${langCode}`]}:{' '}
              <Text style={[styles.infoText, { fontSize }]}>
                {knot.knotenfestigkeit}
              </Text>
            </Text>
            <Text style={[styles.infoTitle, { fontSize }]}>
              {currentTypes[0][`type_${langCode}`]}:{' '}
            </Text>
            <View style={{ marginBottom: 15 }}>
              {currentTypes.map((nm) => (
                <Text
                  style={[styles.infoText, { paddingLeft: 10, fontSize }]}
                  key={nm[`name_${langCode}`]}
                >
                  - {nm[`name_${langCode}`]}
                </Text>
              ))}
            </View>
            <View>
              <Text style={[styles.infoText, { fontSize }]}>
                Used content provided by API. Original source -
              </Text>
              <OpenURLButton url={'https://knots.exyte.top/'}>
                https://knots.exyte.top/
              </OpenURLButton>
            </View>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          {mirrored ? (
            <MirrorRightIcon onPress={this.mirrorImage} />
          ) : (
            <MirrorLeftIcon onPress={this.mirrorImage} />
          )}

          {rotated ? (
            <ReRotateIcon onPress={this.rotateImage} />
          ) : (
            <RotateIcon onPress={this.rotateImage} />
          )}

          {isFinished ? (
            <RepeatIcon onPress={this.playAnimation} />
          ) : paused && !isFinished ? (
            <PlayIcon onPress={this.playAnimation} />
          ) : (
            <PauseIcon onPress={this.pauseAnimation} />
          )}
          {is360 ? (
            <KnotIcon onPress={this.changeView} />
          ) : (
            <Icon360 onPress={this.changeView} />
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.knotBackground,
    flex: 1,
    paddingTop: 10,
  },
  description: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    paddingHorizontal: 10,
  },
  infoTitle: {
    color: theme.knotInfoTitle,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoText: {
    color: theme.knotInfoText,
  },
  attention: {
    marginTop: 10,
    color: theme.knotAttention,
  },
  attentionText: {
    color: theme.knotAttentionText,
  },
  slider: {
    height: 30,
    transform: [{ rotate: '-90deg' }],
  },
  footer: {
    ...theme.knotFooter,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speed: {
    color: '#fff',
    backgroundColor: '#3e7f9b',
    opacity: 0.9,
    padding: 7,
    borderRadius: 16,
    minWidth: 100,
    textAlign: 'center',
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
});

Knot.propTypes = {
  knot: knotPropType,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    goBack: PropTypes.func,
  }),
  like: PropTypes.func,
  langCode: PropTypes.string,
  isPortrait: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

const mapStateToProps = ({
  knots: { knot },
  language: { langCode },
  dimensions: { isPortrait, height, width },
}) => ({
  knot,
  langCode,
  isPortrait,
  height,
  width,
});

const mapDispatchToProps = (dispatch) => ({
  like: (id) => dispatch(knotLike(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Knot);
