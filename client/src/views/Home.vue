<template>
    <section class="h-screen bg-slate-100 grid place-content-center" >
        <div class="" >
            <div class="" >
                <span class="" >
                    <div class="grid grid-cols-[25px,1fr] place-content-center" >
                        <fa icon="square-plus" class="text-[18px]" />
                        <span>Join Room</span>
                    </div>
                   <div class="bg-slate-200" >
                        <div class="grid grid-cols-1" ></div>
                   </div>
                </span>
                <span class="flex gap-3" >
                    <span class="grid place-content-center" >
                        <fa icon="square-plus" class="text-[18px]" />
                    </span>
                    <span>Create Room</span>
                </span>
            </div>
        </div>
    </section>
    <div>
      <h1>Socket.IO Client Example</h1>
      <p v-if="connected">Connected to server</p>
      <p v-else>Not connected to server</p>
    </div>
    <div class="" >
        <div class="" >
            <form @submit.prevent="joinRoom" >
                <input type="text" v-model="name" placeholder="Name" />
                <input type="text" v-model="room" placeholder="Room" />
                <button class="" >Join</button>
            </form>
        </div>
        <div class="bg-slate-200" >
            <h1>LIVE CHAT</h1>
            <div class="relative" >
                <div v-for="(message,index) in messageList" :key="index" class="" >
                    {{ name }}, {{ message.author }}
                    <div v-if="message.author === name" class="grid justify-end pr-5" >
                        <div>
                            <div class="font-extralight text-[14px] capitalize" >{{ message.author }}</div>
                            <div class="bg-blue-400 min-w-[200px] max-w-[300px] p-2 rounded-[10px]" >
                                <span class="text-white">{{ message.message }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="" >
                        <div class="font-extralight text-[14px] capitalize" >{{ message.author }}</div>
                        <div class="bg-slate-400 min-w-[200px] max-w-[300px] p-2 rounded-[10px]" >
                            <span class="text-white">{{ message.message }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex" >
                <form @submit.prevent="sendMessage">
                    <input type="text" name="" v-model="message" id="" placeholder="type here...">
                    <button  >Send</button>
                </form>
            </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import io from 'socket.io-client';

  const showJoin = ref(false);

  const change_showJoin = ()=>{
     (showJoin.value) ? false : true;
  }
  
  const connected = ref(false);
  const socket = io('http://localhost:3000'); // Replace with your server URL

  const name = ref('demo1');
  const room = ref('roomDemo');
  const message = ref(''); 

  const messageList = ref([]);

  const joinRoom = ()=>{
    if(name.value != "" && room.value != ""){
        socket.emit('join_room',room.value)
    }
  };

  const sendMessage = async()=>{
    if(message.value !== ""){
        const data = {
            author: name.value,
            room: room.value,
            message: message.value
        }
        await socket.emit("send_message",data);
        messageList.value.push(data);
        message.value = "";
    }
  }


  onMounted(() => {
    socket.on('connect', () => {
      connected.value = true;
    });

    socket.on("received_message",(data)=>{
        console.log(data);
        messageList.value.push(data);
    })
    
    socket.on('disconnect', () => {
      connected.value = false;
    });
  });
  
  onBeforeUnmount(() => {
    socket.disconnect();
  });
  </script>
  