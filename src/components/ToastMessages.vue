<template>
    <div class="toast-container position-absolute pe-3 top-0 end-0" style="z-index: 1050">
        <EachToast v-for="(msg, key) in messages" :key="key" :msg="msg" />
    </div>
</template>

<script>
import EachToast from '@/components/EachToast.vue';

export default {
    components: { EachToast },
    data() {
        return {
            messages: [], //Messages List
        };
    },
    inject: ['emitter'],
    mounted() {
        // 取出pass in 的message 重要訊息的 style:succes, stitle & content and push into messages[]  
        this.emitter.on('push-message', (message) => {
            const { style = 'success', title, content } = message;
            this.messages.push({ style, title, content });
        });
    },
};
</script>