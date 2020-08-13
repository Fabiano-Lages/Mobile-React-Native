import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';

import styles from './styles';

function TeacherList() {
    const [ isFiltersVisible, setIsFiltersVisible ] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [ favorites, setFavorites ] = useState<number[]>([]);
    const [ assunto, setAssunto ] = useState('');
    const [ dia_da_semana, setDiaDaSemana ] = useState('');
    const [ hora, setHora ] = useState('');


    function carregaFavoritos() {
        AsyncStorage.getItem('favorites').then(response => {
            if(response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersId = favoritedTeachers.map((teacher:Teacher) => {
                    return( teacher.id );
                });
                setFavorites(favoritedTeachersId);
            }
        });
    }

    function handleToggleFilterVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFiltersSubmit() {
        const response = await api.get('classes', {
            params: {
                assunto,
                dia_da_semana,
                hora
            }
        });

        setTeachers(response.data);
        setIsFiltersVisible(false);
        carregaFavoritos();
    }

    return(
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFilterVisible}>
                        <Feather name='filter' size={20} color='#fff' />
                    </BorderlessButton>
                )}
            >
                { isFiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput 
                            style={styles.input}
                            value={assunto}
                            onChangeText={texto => setAssunto(texto) }
                            placeholder='Qual a matéria'
                            placeholderTextColor="#c1bccc"
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={dia_da_semana}
                                    onChangeText={texto => setDiaDaSemana(texto) }
                                    placeholder='Qual o dia'
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={hora}
                                    onChangeText={texto => setHora(texto) }
                                    placeholder='Qual horário'
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>
                        </View>

                        <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                            <Text style={styles.submitButtonText}>Filter</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle= {{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher:Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />
                    );
                })}
            </ScrollView> 
        </View>
    );
}

export default TeacherList;