import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './styles'
import { auth, db } from '../../firebase/config.js'
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const decodedMoodEmoticons = [
  'sentiment-very-dissatisfied',
  'emoticon-angry-outline',
  'sentiment-neutral',
  'sentiment-satisfied',
  'sentiment-very-satisfied',
  'circle-outline',
]

const decodedMoodPhrase = [
  'Sad',
  'Angry',
  'Meh',
  'OK',
  'Happy',
  '-',
]
const decodedMoodColours = [
  '#54539D',
  '#7187D6',
  '#a6808c',
  '#ee964b',
  '#F67251',
  '#0000008A',
]

export default function DetailsScreen(props) {
  const userId = auth.currentUser.uid
  const userRef = db.collection('users').doc(userId)
  const [allEntries, setAllEntries] = useState([])

  const diaryEntries = async () => {
    const user = await userRef.get()
    const entries = user.data().entries

    setAllEntries(entries)
  }

  useEffect(async () => {
    await diaryEntries()
  }, [])

  const targetEntry = props.route.params

  const deleteEntry = (targetEntry) => {
    db.collection('users')
      .doc(userId)
      .update({
        entries: allEntries.filter(
          (entry) => entry.writtenDiary !== targetEntry.writtenDiary,
        ),
      })
      .then(() => console.log('diary entry deleted!'))
  }

  const entryObj = allEntries.filter(
    (entry) => entry.date === props.route.params.date,
  )[0]
  if (entryObj) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: '90%',
            margin: 15,
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginTop: 50,
            }}
          >
          {entryObj.mood == 1 ? 
            <FontIcon
                  name="emoticon-angry-outline"
                  color={decodedMoodColours[entryObj.mood]}
                  size={120}
                /> : <Icon
              name={decodedMoodEmoticons[entryObj.mood]}
              color={decodedMoodColours[entryObj.mood]}
              size={120}
              type={entryObj.mood < 5? 'ionicons' : 'material-community'}
            />
          }
            
            <View style={{ paddingHorizontal: 15 }}>
              <Text
                style={[
                  styles.h1,
                  { color: decodedMoodColours[entryObj.mood] },
                ]}
              >
                {decodedMoodPhrase[entryObj.mood]}
              </Text>
              <Text style={[styles.text, { fontWeight: '700' }]}>
                {entryObj.date}
              </Text>

              <Text style={[styles.text, { fontWeight: '700' }]}>
                {targetEntry.writtenDiary}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                deleteEntry(targetEntry)
                props.navigation.goBack()
              }}
            >
              <Text style={{ color: 'white', fontSize: 15 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  } else {
    return null
  }
}
