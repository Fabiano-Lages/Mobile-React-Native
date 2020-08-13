import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(() => {
        carregaFavoritos();
    });
    
    function carregaFavoritos() {
        AsyncStorage.getItem('favorites').then(response => {
            if(response) {
                setFavorites(JSON.parse(response));
            }
        });
    }

    return(
        <View style={styles.container}>
            <PageHeader title="Meus proffys favoritos" headerRight={ (<Text>{' '}</Text>) } />
            <ScrollView 
                style={styles.favorites}
                contentContainerStyle= {{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >

                {favorites.map((teacher:Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={true}
                        />
                    );
                })}
            </ScrollView>

        </View>
    );
}

export default Favorites;