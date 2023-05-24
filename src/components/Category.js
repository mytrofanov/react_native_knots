import React from 'react';
import PropTypes from "prop-types";
import {Text, StyleSheet, TouchableOpacity, View, Image, StatusBar} from 'react-native';

import theme from '../styles/theme';

const calculateFontSizeName = (width) => (width > 500 ? 32 : 18);

const calculateFontSizeSubName = (width) => (width > 500 ? 22 : 12);

const calculateImageSize = (isPortrait, height) =>
  !isPortrait ? height / 3 : height / 8;

const CategoryWrapper = React.memo((props) => {
  const { children, onPress, active, height } = props;
  const [bgColor, setBgColor] = React.useState(
    active ? theme.categorySelect : theme.background
  );

  return (
    <TouchableOpacity
      style={{ backgroundColor: bgColor }}
      activeOpacity={1}
      onPressIn={() => setBgColor(theme.categorySelect)}
      onPress={onPress}
      onPressOut={() => setBgColor(theme.background)}
    >
      <View style={[{ minHeight: height / 8 }, styles.category]}>
        {children}
      </View>
    </TouchableOpacity>
  );
});

CategoryWrapper.propTypes = {
  onPress: PropTypes.func,
  active: PropTypes.bool,
  height: PropTypes.number,
};

const Category = React.memo((props) => {
  const { data, onPress, active, isPortrait, height, width } = props;
  const { name, image, count } = data;

  return (
    <CategoryWrapper onPress={onPress} active={active} height={height}>
      <View style={styles.categoryImgWrapper}>
        <Image
          source={image}
          resizeMode="contain"
          style={{ height: calculateImageSize(isPortrait, height) }}
        />
      </View>
      <View style={[styles.nameWrapper, { flexBasis: (width / 100) * 55 }]}>
        <Text
          style={[
            styles.categoryName,
            { fontSize: calculateFontSizeName(width) },
          ]}
        >
          {name}
        </Text>
      </View>
      <Text
        style={[
          styles.categoryCount,
          { fontSize: calculateFontSizeName(width) },
        ]}
      >
        {count}
      </Text>
    </CategoryWrapper>
  );
});

export default Category;

export const KnotCategory = (props) => {
  const { data, onPress, active, isPortrait, height, width } = props;
  const { name, image } = data;
  const names = name.split('_');

  return (
    <CategoryWrapper onPress={onPress} active={active} height={height}>
      <StatusBar />
      <View style={styles.categoryImgWrapper}>
        <Image
          source={image}
          resizeMode="contain"
          style={{ height: calculateImageSize(isPortrait, height) }}
        />
      </View>
      <View style={[styles.nameWrapper, { flexBasis: (width / 100) * 75 }]}>
        <Text
          style={[
            styles.categoryName,
            { fontSize: calculateFontSizeName(width) },
          ]}
        >
          {names[0]}
        </Text>
        <View style={styles.subnameWrapper}>
          <Text
            style={[
              styles.subname,
              { fontSize: calculateFontSizeSubName(width) },
            ]}
          >
            {names.join(', ')}
          </Text>
        </View>
      </View>
    </CategoryWrapper>
  );
};

export const LanguageCategory = (props) => {
  const { name, onPress, active, height, width } = props;

  return (
    <CategoryWrapper onPress={onPress} active={active} height={height}>
      <Text
        style={[
          styles.categoryName,
          { fontSize: calculateFontSizeName(width) },
        ]}
      >
        {name}
      </Text>
    </CategoryWrapper>
  );
};

const dataProp = PropTypes.shape({
  name: PropTypes.string,
  image: PropTypes.number,
  count: PropTypes.number,
});

const categoryPropTypes = {
  onPress: PropTypes.func,
  active: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  isPortrait: PropTypes.bool,
};

const categoryDefaultProps = {
  active: false,
};

Category.propTypes = {
  ...categoryPropTypes,
  data: dataProp,
};
Category.defaultProps = {
  ...categoryDefaultProps,
};

KnotCategory.propTypes = {
  ...categoryPropTypes,
  data: dataProp,
};
KnotCategory.defaultProps = {
  ...categoryDefaultProps,
};

LanguageCategory.propTypes = {
  ...categoryPropTypes,
  name: PropTypes.string,
};
LanguageCategory.defaultProps = {
  ...categoryDefaultProps,
};

const styles = StyleSheet.create({
  category: {
    ...theme.category,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  categoryImgWrapper: {
    flexBasis: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    color: theme.text,
  },
  nameWrapper: {
    marginLeft: 15,
    paddingRight: 25,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  subnameWrapper: {
    flexDirection: 'row',
  },
  subname: {
    marginTop: 10,
    color: theme.secondaryText,
  },
  categoryCount: {
    color: theme.text,
    flexBasis: '15%',
    textAlign: 'center',
  },
});
