import React, { useState, useEffect, Component } from "react"

import Player from "../../assets/torch.png"
import PlayerList from "../playerList/playerList"

import { axiosWithAuth } from "../../utils/axiosWithAuth"

import Directions from "../Directions"

export default class Canvas extends Component {
  state = {
    x: 50,
    y: 50,
    torchW: 100,
    torchH: 100,
    tileW: 40,
    tileH: 40,
    location: {
      direction: null
    },
    room: {
      name: null,
      currentRoom: null,
      roomDescription: null,
      players: null
    },
    gameMapArr: []
  }

  drawCanvas = () => {
    const ctx = this.refs.canvas.getContext("2d")
    //draw tiles that make up game map
    //beign by looping through each tile
    for (let y = 0; y < 47; y++) {
      //for each row, go left to right
      for (let x = 0; x < 47; x++) {
        //switch statement lets us choose which color to draw curent tile with
        //find value at corresponding game map index by y*mapW and add x
        // switch (this.state.gameMapArr[y * 47 + x]) {
        //   case 0:
        //     ctx.fillStyle = "#999999"
        //     break
        //   default:
        //     ctx.fillStyle = "#eeeeee"
        // }

        if (this.state.gameMapArr[y * 47 + x]) {
          ctx.fillStyle = "#eee"
        } else {
          ctx.fillStyle = "#999"
        }

        console.log("hit")
        //draw rectangle at coresponding position tile
        ctx.fillRect(
          x * this.state.tileW,
          y * this.state.tileH,
          this.state.tileW,
          this.state.tileH
        )
        break
      }
    }
  }

  drawTorch = (x, y, width, height) => {
    const ctx = this.refs.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)

    const img = new Image()
    img.src = Player

    ctx.drawImage(img, x, y, width, height)
  }

  componentDidMount = () => {
    axiosWithAuth()
      .get("/api/adv/init/")
      .then(res => {
        this.setState({
          ...this.state,
          room: {
            currentRoom: res.data.title,
            roomDescription: res.data.description,
            name: res.data.name,
            players: res.data.players
          }
        })
        .catch(err => err.err)  

        setInterval(() => {
            this.drawTorch(this.state.x, this.state.y, this.state.width, this.state.height);
        }, 1000 / 30);

        document.addEventListener('keydown', (e) => {
            let temp;
            const ctx = this.refs.canvas.getContext('2d');
            // checking for which key is pressed
            if (e.key === "w") {
              // setting temp var to capture value of y
              temp = this.state.y
              temp -= 100

              // if y value - 100 is still greater than zero, do movement as normal
              if (temp > 0) {

                // console.log(this.state.y)sss
                this.setState({
                  ...this.state,
                  y: temp,
                  location: {
                    direction: 'n'
                  }
                })
              }

            } else if (e.key === 'a') {
              // setting temp var to capture value of y
              temp = this.state.x
              temp -= 100
              
              // if x value - 100 is still greater than zero, do movement as normal
              if (temp > 0) {

                this.setState({
                  ...this.state,
                  x: temp,
                  location: {
                    direction: 'w'
                  }
                })
              }

            } else if (e.key === 's') {
              // setting temp var to capture value of y
              temp = this.state.y + 100
              // temp += 100
              // if y value - 100 is still greater than zero, do movement as normal
              if (temp < ctx.canvas.height) {
                this.setState({
                  ...this.state,
                  y: this.state.y + 100,
                  location: {
                    direction: 's'
                  }
                })
              }



            } else if (e.key === 'd') {
              temp = this.state.x
              temp += 100
              // if x value - 100 is still greater than zero, do movement as normal
              if (temp < ctx.canvas.width) {

                this.setState({
                  ...this.state,
                  x: temp,
                  location: {
                    direction: 'e'
                  }
                })
              }
            }
            
            axiosWithAuth()
              .post("api/adv/move/", this.state.location)
              .then(res => {
                this.setState({
                    ...this.state,
                    room: {
                        name: res.data.name,
                        currentRoom: res.data.title,
                        roomDescription: res.data.description,
                        players: res.data.players
                    }
                })
                console.log("moveNorth Res: ", res.data)
              })
              .catch(err => {
                console.log("North Error: ", err.res)
              })
          })
        }

        
        render() {
          console.log(this.state)
        return (

            <div>
              <PlayerList
                players={this.state.room.players}
                current={this.state.room.name}
              />
              <p>{this.state.room.currentRoom}</p>
              <p>{this.state.room.roomDescription}</p>
            </div>
          )}
        </div>
        <canvas
          ref="canvas"
          id="canvas"
          width="1040"
          height="650"
          style={{ border: "4px solid green" }}
        ></canvas>
      </div>
    )
  }
}
