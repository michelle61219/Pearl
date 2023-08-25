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
                        <ul class="list-unstyled">
                            <li v-for="(object, i) in item.products" :key="i">
                                <div style="float: left; width: 50%;">{{ object.product.title }}</div>
                                <div style="float: right; width: 50%;">數量：{{ object.qty }}<small>({{ object.product.unit
                                }})</small>
                                </div>
                            </li>
                        </ul>
                    </td>
                    <td class="text-right">{{ item.total }}</td>
                    <td>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" :id="`paidSwitch$(item.id)`"
                                v-model="item.is_paid" @change="updatePaid(item)">
                            <label :for="`paidSwitch$(item.id)`" class="form-check-label">
                                <span class="text-success" v-if="item.is_paid">已付款</span>
                                <span v-else>未付款</span>
                            </label>
                        </div>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">檢視</button>
                            <button class="btn btn-outline-danger btn-sm" @click="openDelOrderModal(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    <OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid"></OrderModal>
    <DelModal ref="delModal" :item="tempOrder" @del-item="delOrder"></DelModal>
    <PaginationComponent :pages="pagination" @emit-pages="getOrders"></PaginationComponent>
</template>

<script>
import OrderModal from '@/components/OrderModal.vue';
import DelModal from '@/components/DelModal.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
    data() {
        return {
            orders: {},
            isNew: false,
            pagination: {},
            isLoading: false,
            tempOrder: {},
        };
    },
    components: {
        OrderModal,
        DelModal,
        PaginationComponent,
    },
    inject: ['pushMessageState'],
    methods: {
        getOrders(page = 1) {
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders/?page=${page}`;
            this.isLoading = true;
            this.$http.get(url, this.tempProduct).then((res) => {
                this.isLoading = false;
                if (res.data.success) {
                    this.orders = res.data.orders;
                    this.pagination = res.data.pagination;
                }
            });
        },
        openModal(isNew, item) {
            this.tempOrder = { ...item };
            this.isNew = false;
            const orderComponent = this.$refs.orderModal;
            orderComponent.showModal();
        },
        openDelOrderModal(item) {
            this.tempOrder = { ...item };
            const delComponent = this.$refs.delModal;
            delComponent.showModal();
        },
        updatePaid(item) {
            this.Loading = true;
            const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`;
            const paid = {
                is_paid: item.is_paid,
            };
            this.$http.put(api, { data: paid }).then((response) => {
                this.isLoading = false;
                this.getOrders(this.page);
                // <---Push Toast Messages HERE--->
                this.pushMessageState(response, '更新付款狀態');
            });
        },
        delOrder() {
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`;
            this.isLoading = true;
            this.$http.delete(url).then((response) => {
                console.log(response);
                this.pushMessageState(response, "刪除訂單");
                const delComponent = this.$refs.delModal;
                delComponent.hideModal();
                this.getOrders(this.page);
            });
        },
    },
    created() {
        this.getOrders();
    },
};
</script>

