<template>
    <LoadingOverlay :active="isLoading"></LoadingOverlay>
    <div class="container">
        <div class="row mt-4">
            <div class="col-md-7">
                <!-- product list -->
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th>圖片</th>
                            <th>商品名稱</th>
                            <th>價格</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in products" :key="item.id">
                            <td style="width: 200px">
                                <div style=" height: 100px; background-size: cover;background-position: center;"
                                    :style="{ backgroundImage: `url(${item.imageUrl})` }"></div>
                            </td>
                            <td>
                                <h4>{{ item.title }}</h4>
                            </td>
                            <td>
                                <div class="h5" v-if="!item.price">
                                    {{ item.origin_price }} 元
                                </div>
                                <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                                <div class="h5" v-if="item.price">
                                    現在只要 {{ item.price }} 元
                                </div>
                            </td>
                            <td>
                                <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-outline-secondary" @click="getProduct(item.id)">
                                        查看更多
                                    </button>
                                    <button type="button" class="btn btn-outline-danger"
                                        :disabled="this.status.loadingItem === item.id" @click="addCart(item.id)">
                                        <div v-if="this.status.loadingItem === item.id"
                                            class="spinner-grow text-danger spinner-grow-sm" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        加到購物車
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 購物車列表 -->
            <div class="col-md-5">
                <div class="sticky-top">
                    <table class="table align-middle">
                        <thead>
                            <tr>
                                <th></th>
                                <th>品名</th>
                                <th style="width: 140px">數量</th>
                                <th>單價</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="cart.carts">
                                <tr v-for="item in cart.carts" :key="item.id">
                                    <td>
                                        <button type="button" class="btn btn-outline-danger btn-sm"
                                            :disabled="status.loadingItem === item.id" @click="removeCartItem(item.id)">
                                            <i class="bi bi-x"></i>
                                        </button>
                                    </td>
                                    <td>
                                        {{ item.product.title }}
                                        <!-- to do coupon -->
                                        <div class="text-success">已套用優惠券</div>
                                    </td>
                                    <td>
                                        <div class="input-group input-group-sm">
                                            <input type="number" class="form-control"
                                                min="1"
                                                :disabled="item.id === status.loadingItem"
                                                @change="updateCart(item)"
                                                v-model.number="item.qty">
                                            <div class="input-group-text"> {{ item.product.unit }} </div>
                                        </div>
                                    </td>
                                    <td>
                                        {{ item.product.origin_price }}
                                    </td>
                                    <td class="text-end">
                                        <!-- <small v -if ="cart.final_total !== cart.total" class="text-success">折扣價：</small> 
                                                        {{ $filters.currency(item.final_total) }}  -->
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-end">總計</td>
                                <td class="text-end">{{ $filters.currency(cart.total) }}</td>
                            </tr>
                            <!-- <tr v -if ="cart.final_total !== cart.total">
                                 <td colspan="3" class="text-end text-success">折扣價</td>
                                <td class="text-end text-success"> {{ $filters.currency(cart.final_total) }} </td>
                                </tr> -->
                        </tfoot>
                    </table>
                    <div class="input-group mb-3 input-group-sm">
                        <input type="text" class="form-control" placeholder="請輸入優惠碼" />
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button">
                                套用優惠碼
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            products: [],
            //product: { }, // 單一選項(detailed product page)
            status: {
                loadingItem: "", // 對應品項id, prevents overclicking addCart button
            },
            cart: {},
            coupon_code: " ",
        };
    },
    inject: ["pushMessageState"],
    methods: {
        getProducts() {
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products/all`;
            this.isLoading = true;
            this.$http.get(url).then((response) => {
                this.products = response.data.products;
                // console.log('products:', response);
                this.isLoading = false;
            });
        },
        getProduct(id) {
            this.$router.push(`/user/product/${id}`);
        },
        addCart(id) {
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
            this.status.loadingItem = id;
            const cart = {
                product_id: id,
                qty: 1,
            };
            this.$http.post(url, { data: cart }).then((res) => {
                this.status.loadingItem = " ";
                console.log(res);
            });
        },
        getCart() {
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
            this.isLoading = true;
            this.$http.get(url).then((response) => {
                // data.data.carts (All products in cart) & finall_total cost
                this.cart = response.data.data;
                this.isLoading = false;
            });
        },
        // 更新購物車
        updateCart(item) {
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
            this.isLoading = true;
            this.status.loadingItem = item.id;
            const cart = {
                product_id: item.product_id,
                qty: item.qty,
            };
            this.$http.put(url, { data: cart }).then((res) => {
                console.log(res);
                this.status.loadingItem = " ";
               this.getCart();
            });
        },
        // 刪除購物車裡不要的商品
        removeCartItem(id) {
            this.status.loadingItem = id;
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`;
            this.isLoading = true;
            this.$http.delete(url).then((response) => {
                this.pushMessageState(response, "移除購物車品項");
                this.status.loadingItem = "";
                this.getCart();
                this.isLoading = false;
            });
        },
    },
    created() {
        this.getProducts();
        this.getCart();
    },
};
</script>
