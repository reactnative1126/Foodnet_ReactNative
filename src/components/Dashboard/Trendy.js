import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import i18n from '@utils/i18n';

import moment from 'moment';
import FastImage from 'react-native-fast-image';
import ContentLoader from 'react-native-easy-content-loader';

const RenderItem = ({ trendy, index, onDetail }) => {
  const [loader, setLoader] = useState(true);
  return (
    <Fragment>
      <ContentLoader
        active
        title={false}
        pRows={3}
        pWidth={[200, 150, 50]}
        pHeight={[125, 10, 20]}
        loading={loader}
        containerStyles={styles.loader}
      />
      <TouchableOpacity key={index} style={loader ? styles.default : styles.trendy} onPress={() => onDetail(trendy.item)}>
        <FastImage style={styles.image} source={{ uri: RES_URL + trendy.item.restaurant_coverImage }} onLoadEnd={e => setLoader(false)} />
        {!loader && (
          <Fragment>
            {(parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(trendy.item.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(trendy.item.restaurant_close.replace(':', ''))) && (
              <View style={styles.overlay}><Text style={styles.closeText}>{i18n.translate('CLOSED')}</Text></View>
            )}
            <Text style={[styles.title, (parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(trendy.item.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(trendy.item.restaurant_close.replace(':', ''))) && styles.disabled]} numberOfLines={1}>{trendy.item.restaurant_name}</Text>
            <View style={styles.rating}>
              <Icon type='material' name='star-border' size={15} color={colors.YELLOW.PRIMARY} />
              <Text style={styles.rate}>{trendy.item.restaurant_rating}/5</Text>
            </View>
            <Text style={[styles.description, (parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(trendy.item.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(trendy.item.restaurant_close.replace(':', ''))) && styles.disabled]} numberOfLines={2}>{trendy.item.restaurant_description}</Text>
          </Fragment>
        )}
      </TouchableOpacity>
    </Fragment>
  )
}

export default Trendy = (props) => {
  useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

  return (
    <Card key='trendy' style={styles.card}>
      <Text style={styles.cardTitle}>{i18n.translate('Trendy restaurants')}</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={props.data}
        keyExtractor={(trendy, index) => index.toString()}
        renderItem={(trendy, index) => (<RenderItem trendy={trendy} index={index} onDetail={props.onDetail} />)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: 20
  },
  cardTitle: {
    marginVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111'
  },
  loader: {
    marginTop: -10,
    marginRight: 16,
    width: 200,
  },
  default: {
    width: 0
  },
  trendy: {
    marginRight: 16,
    width: 200,
  },
  image: {
    width: 200,
    height: 125,
    borderRadius: 8
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 125,
    backgroundColor: '#000000D0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.WHITE
  },
  title: {
    width: '100%',
    marginVertical: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111'
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    width: 50,
    height: 25,
    backgroundColor: '#FEEBD6',
    borderRadius: 6
  },
  rate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.YELLOW.PRIMARY
  },
  description: {
    marginVertical: 8,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21
  },
  disabled: {
    opacity: 0.5
  },
  time: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.RED.PRIMARY
  }
});