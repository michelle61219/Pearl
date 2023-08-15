<template>
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
            <tr>
                <td>2013/1/1</td>
                <td>michelle@gmail.com</td>
                <td class="text-right">
                    帽子1件
                </td>
                <td class="text-right">
                    10000
                </td>
                <td>
                    <span class="text-success">已付款</span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm">編輯</button>
                        <button class="btn btn-outline-danger btn-sm">刪除</button>
                    </div>
                </td>
            </tr>
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

