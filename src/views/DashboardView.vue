<template>
    <NavbarComponent></NavbarComponent>
    <div class="container-fluid mt-3 position-relative">
        <ToastMessages></ToastMessages>
        <router-view />
    </div>
</template>

<script>
import emitter from '@/methods/emitter';
import ToastMessages from '@/components/ToastMessages.vue';
import NavbarComponent from '@/components/NavbarComponent.vue';
import pushMessageState from '@/methods/pushMessageState';

export default {
    components: {
        NavbarComponent,
        ToastMessages,
    },
    provide() {
        return {
            emitter,
            pushMessageState,
        };
    },
    created() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        // console.log(token);
        this.$http.defaults.headers.common.Authorization = `${token}`;

        const api = `${process.env.VUE_APP_API}api/user/check`;
        this.$http.post(api, this.user).then((res) => {
            // console.log(res);
            if (!res.data.success) {
                this.$router.push('/login');
            }
        });
    },
};
</script>
