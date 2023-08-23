<template>
    <LoadingOverlay :active="isLoading"></LoadingOverlay>
    <table class="table mt-4">
        <thead>
            <tr>
                <th>購買時間</th>
                <th>Email</th>
                <th>購買款項</th>
                <th>應付金額</th>
                <th>是否付款</th>
                <th>編輯</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(item, key) in orders" :key="key">
                <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
                    <td>{{ $filters.date(item.create_at) }}</td>
                    <td><span v-text="item.user.email" v-if="item.user"></span></td>
                    <td>
                    </td>
                    <td class="text-right">{{ item.total }}</td>
                    <td>
                        <span class="text-success" v-if="item.is_paid">已付款</span>
                        <span v-else>未付款</span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-outline-primary btn-sm">檢視</button>
                            <button class="btn btn-outline-danger btn-sm">刪除</button>
                        </div>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    <PaginationComponent :pages="pagination" @emit-pages="getOrders"></PaginationComponent>
</template>

<script>
import PaginationComponent from '@/components/PaginationComponent.vue';

export default ({
    data() {
        return {
            orders: [],
            pagination: {},
            isLoading: false,
        }
    },
    components: {
        PaginationComponent,
    },
    methods: {
        getOrders(page = 1) {
            const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders/?page=${page}`;
            //this.isLoading = true;
            this.$http.get(api).then((res) => {
                //this.isLoading = false;
                if (res.data.success) {
                    console.log(res.data);
                    this.orders = res.data.orders;
                    this.pagination = res.data.pagination; // 存起來的pagination
                }
            });
        },
    },
    created() {
        this.getOrders();
    },
});
</script>

