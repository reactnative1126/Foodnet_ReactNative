import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RemoveIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Filters = (props) => {
  const [freeDelivery, setFreeDelivery] = useState(props.filters.freeDelivery);
  const [newest, setNewest] = useState(props.filters.newest);
  const [pizza, setPizza] = useState(props.filters.pizza);
  const [hamburger, setHamburger] = useState(props.filters.hamburger);
  const [dailyMenu, setDailyMenu] = useState(props.filters.dailyMenu);
  const [soup, setSoup] = useState(props.filters.soup);
  const [salad, setSalad] = useState(props.filters.salad);
  const [money, setMoney] = useState(props.filters.money);
  const [card, setCard] = useState(props.filters.card);
  const [withinOneHour, setWithinOneHour] = useState(props.filters.withinOneHour);

  const onReset = () => {
    setFreeDelivery(0);
    setNewest(0);
    setPizza(0);
    setHamburger(0);
    setDailyMenu(0);
    setSoup(0);
    setSalad(0);
    setMoney(0);
    setCard(0);
    setWithinOneHour(0);
  }

  return (
    <Content style={styles.content}>
      <View style={styles.resetView}>
        <TouchableOpacity onPress={() => onReset()}>
          <RemoveIcon />
        </TouchableOpacity>
      </View>
      <Card key='result1' style={styles.card}>
        <Text style={styles.cardTitle}>{i18n.translate('Foods')}</Text>
        <View key='filter1' style={styles.itemView}>
          <TouchableOpacity style={[styles.itemButton, hamburger ? common.borderColorYellow : null]} onPress={() => setHamburger(!hamburger)}>
            <Text style={[styles.itemText, hamburger ? styles.itemBold : null]}>{i18n.translate('Hamburger')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemButton, pizza ? common.borderColorYellow : null]} onPress={() => setPizza(!pizza)}>
            <Text style={[styles.itemText, pizza ? styles.itemBold : null]}>{i18n.translate('Pizza')}</Text>
          </TouchableOpacity>
        </View>
        <View key='filter2' style={styles.itemView}>
          <TouchableOpacity style={[styles.itemButton, soup ? common.borderColorYellow : null]} onPress={() => setSoup(!soup)}>
            <Text style={[styles.itemText, soup ? styles.itemBold : null]}>{i18n.translate('Soup')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemButton, dailyMenu ? common.borderColorYellow : null]} onPress={() => setDailyMenu(!dailyMenu)}>
            <Text style={[styles.itemText, dailyMenu ? styles.itemBold : null]}>{i18n.translate('Daily menu')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemButton, salad ? common.borderColorYellow : null]} onPress={() => setSalad(!salad)}>
            <Text style={[styles.itemText, salad ? styles.itemBold : null]}>{i18n.translate('Salat')}</Text>
          </TouchableOpacity>
        </View>
      </Card>
      <Card key='result2' style={styles.card}>
        <Text style={styles.cardTitle}>{i18n.translate('Useful')}</Text>
        <View key='filter3' style={styles.itemView}>
          <TouchableOpacity style={[styles.itemButton, freeDelivery ? common.borderColorYellow : null]} onPress={() => setFreeDelivery(!freeDelivery)}>
            <Text style={[styles.itemText, freeDelivery ? styles.itemBold : null]}>{i18n.translate('No shipping costs')}</Text>
          </TouchableOpacity>
        </View>
        <View key='filter4' style={styles.itemView}>
          <TouchableOpacity style={[styles.itemButton, newest ? common.borderColorYellow : null]} onPress={() => setNewest(!newest)}>
            <Text style={[styles.itemText, newest ? styles.itemBold : null]}>{i18n.translate('News')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemButton, withinOneHour ? common.borderColorYellow : null]} onPress={() => setWithinOneHour(!withinOneHour)}>
            <Text style={[styles.itemText, withinOneHour ? styles.itemBold : null]}>{i18n.translate('Within 1 hour')}</Text>
          </TouchableOpacity>
        </View>
      </Card>
      <Card key='result3' style={styles.card}>
        <Text style={styles.cardTitle}>{i18n.translate('Payment options')}</Text>
        <View key='filter5' style={styles.itemView}>
          <TouchableOpacity style={[styles.itemButton, money ? common.borderColorYellow : null]} onPress={() => setMoney(!money)}>
            <Text style={[styles.itemText, money ? styles.itemBold : null]}>{i18n.translate('Cash')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemButton, card ? common.borderColorYellow : null]} onPress={() => setCard(!card)}>
            <Text style={[styles.itemText, card ? styles.itemBold : null]}>{i18n.translate('Card')}</Text>
          </TouchableOpacity>
        </View>
        <View key='filter6' style={styles.itemBorder} />
      </Card>
      <View style={styles.bottomView}>
        <TouchableOpacity style={[styles.button, common.backColorYellow]} onPress={() => props.onFilters({
          freeDelivery: freeDelivery ? 1 : 0,
          newest: newest ? 1 : 0,
          pizza: pizza ? 1 : 0,
          hamburger: hamburger ? 1 : 0,
          dailyMenu: dailyMenu ? 1 : 0,
          soup: soup ? 1 : 0,
          salad: salad ? 1 : 0,
          money: money ? 1 : 0,
          card: card ? 1 : 0,
          withinOneHour: withinOneHour ? 1 : 0

        })}>
          <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Search')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => props.onCancel()}>
          <Text style={styles.cancelText}>{i18n.translate('Cancel')}</Text>
        </TouchableOpacity>
      </View>
      <View style={common.height50} />
    </Content>
  );
}

const styles = StyleSheet.create({
  content: {
    width: wp('100%'),
    padding: 20
  },
  resetView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  card: {
    width: '100%',
    marginBottom: 20
  },
  cardTitle: {
    marginVertical: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111'
  },
  itemView: {
    flexDirection: 'row',
    paddingVertical: 5,
    width: '100%'
  },
  itemButton: {
    marginRight: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: '#C4C4C4',
    borderRadius: 6
  },
  itemText: {
    fontSize: 14,
    color: '#333'
  },
  itemBold: {
    fontWeight: 'bold'
  },
  itemBorder: {
    marginTop: 24,
    width: '100%',
    height: 1,
    backgroundColor: '#C4C4C4'
  },
  bottomView: {
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 6,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666'
  }
});