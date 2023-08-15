<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">範例作業</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <router-link to="/dashboard/products" class="nav-link">產品</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/dashboard/orders" class="nav-link">訂單</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/dashboard/coupons" class="nav-link">優惠劵</router-link>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click.prevent="logout">登出</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
export default {
    methods: {
        logout() {
            const api = `${process.env.VUE_APP_API}logout`;
            this.$http.post(api, this.user).then((res) => {
                if (res.data.success) {
                    this.$router.push('/login');
                }
            });
        },
    },
};
</script>
