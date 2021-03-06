import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar/navigationBar';
import MusicTable from './MusicTable/musicTable';
import AddSong from './AddSong/addSong';
import EditSong from './EditSong/editSong';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            songs:[],
            editSong: [],
        }
    }
    componentDidMount() {
        this.renderTable()
        
    }
    renderTable = async() => {
        let response = await axios.get(`http://127.0.0.1:8000/music/`)
            let allMusic = response.data
            this.setState ({
                songs: allMusic,
            });
    }
        removeSong = async (song) => {
        await axios.delete(`http://127.0.0.1:8000/music/${song.id}/`)
        this.renderTable()

    }
    editSong = (song)  => {
        let songToBeEdited = song
        this.setState ({
            editSong: songToBeEdited,
        });
    }

    updateSongLikes = async(songId, data) => {
        await axios.put(`http://127.0.0.1:8000/music/${songId}/`, data)
        this.renderTable()

    }

    likeSong = async (song) => {
        const data = {
            title: song.title,
            artist: song.artist,
            album: song.album,
            release_date: song.release_date,
            genre: song.genre,
            likes: song.likes + 1
        }
        this.updateSongLikes(song.id, data)
    }
    
    render(){
            return (
                <Router>
                    <div className="App">
                    <NavigationBar />
                    <Switch>
                        <Route path="/"  exact render={(props) => (<MusicTable {...props} music={this.state.songs} deleteSong={this.removeSong} editSong={this.editSong} likeSong={this.likeSong}/>)} />
                        <Route path="/addSong/" render={(props) => (<AddSong {...props} allSongs={this.state.songs} renderTable={this.renderTable}/>)}/>
                        <Route path="/editSong/" render={(props) => (<EditSong {...props} song={this.state.editSong} renderTable={this.renderTable}/>)}/>
                    </Switch>
                    </div>
                </Router>
            );
    }
}
export default App