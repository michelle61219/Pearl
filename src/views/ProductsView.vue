<template>
    <LoadingOverlay :active="isLoading"></LoadingOverlay>
    <div class="text-end">
        <button class="btn btn-primary" type="button" @click="openModal(true)">
            建立新的產品
        </button>
    </div>
    <table class="table mt-4">
        <thead>
            <tr>
                <th width="250">圖片</th>
                <th width="120">分類</th>
                <th width="150">產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="100">是否啟用</th>
                <th width="200">編輯</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in products" :key="item.id">
                <td style="width: 200px">
                    <div style=" height: 180px; background-size: cover;background-position: center;"
                        :style="{ backgroundImage: `url(${item.imageUrl})` }"></div>
                </td>
                <td>{{ item.category }}</td>
                <td>{{ item.title }}</td>
                <td class="text-right">
                    {{ $filters.currency(item.origin_price) }}
                </td>
                <td class="text-right">
                    {{ $filters.currency(item.price) }}
                </td>
                <td>
                    <span class="text-success" v-if="item.is_enabled">啟用</span>
                    <span class="text-muted" v-else>未啟用</span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)"> 編輯 </button>
                        <button class=" btn btn-outline-danger btn-sm" @click="openDelProductModal(item)">刪除</button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <PaginationComponent :pages="pagination" @emit-pages="getProducts"></PaginationComponent>
    <ProductModal ref="productModal" :product="tempProduct" @update-product="updateProduct"></ProductModal>
    <DelModal ref="delModal" :item="tempProduct" @del-item="delProduct"></DelModal>
</template>

<script>
import ProductModal from '@/components/ProductModal.vue';
import DelModal from '@/components/DelModal.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
    data() {
        return {
            // 所有產品資訊
            products: [], // 產品資料
            pagination: {}, // 分頁資料
            tempProduct: {}, // 編輯資料的暫存
            isNew: false, // 檢查資料是否為更新過的，紀錄狀態
            isLoading: false,
        };
    },
    components: {
        ProductModal,
        DelModal,
        PaginationComponent,
    },
    inject: ['emitter', 'pushMessageState'],
    methods: {
        // 多數產品資料，取名 + s
        getProducts(page = 1) {
            const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products/?page=${page}`;
            this.isLoading = true;
            this.$http.get(api).then((res) => {
                this.isLoading = false;
                if (res.data.success) {
                    // console.log(res.data);
                    this.products = res.data.products;
                    this.pagination = res.data.pagination; // 存起來的pagination
                }
            });
        },
        // 獨立一個 Method 顯示 Modal
        openModal(isNew, item) {
            //console.log(isNew, item);
            if (isNew) {
                // 再次清空 
                this.tempProduct = {};
            } else {
                // 從上面的空tempProduct存取 pass 之前就進來的item 
                this.tempProduct = { ...item };
            }
            // 存起來之後做判斷用
            this.isNew = isNew;
            const productComponent = this.$refs.productModal;
            productComponent.showModal();
        },
        updateProduct(item) {
            // console.log(item);
            this.tempProduct = item;

            // 新增
            let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
            let httpMethod = 'post';

            // 編輯
            if (!this.isNew) {
                api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
                httpMethod = 'put';
            }
            const productComponent = this.$refs.productModal;
            this.isLoading = true;
            this.$http[httpMethod](api, { data: this.tempProduct }).then((response) => {
                this.isLoading = false;
                console.log(response);
                productComponent.hideModal();

                // <---Push Toast Messages HERE--->
                this.pushMessageState(response, '更新產品狀態');
                this.getProducts();
            });
        },
        openDelProductModal(item) {
            this.tempProduct = { ...item };
            const delComponent = this.$refs.delModal;
            delComponent.showModal();
        },
        delProduct() {
            const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
            this.isLoading = true;
            this.$http.delete(url).then((response) => {
                console.log(response.data)
                this.pushMessageState(response, "刪除產品");
                const delComponent = this.$refs.delModal;
                delComponent.hideModal();
                this.getProducts();
            });
        },
    },
    created() {
        this.getProducts();
    },
};
</script>