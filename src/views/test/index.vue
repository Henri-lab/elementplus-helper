<template>
    <div>
        <div style="color: antiquewhite; 
        font-size: 20px;
        background-color: black;
        text-align: center;
        ">
            welcome testing components!
        </div>
        <div class="test-btns">
            <router-link class="item" to="/testComponents/Tree">
                <el-button>
                    TreeComponent
                </el-button>
            </router-link>
            <router-link class="item" to="/testComponents/Table">
                <el-button>
                    TableComponent
                </el-button>
            </router-link>
        </div>
        <el-divider>components</el-divider>
        <div class="components">
            <router-view></router-view>
        </div>

    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.test-btns {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    /* 自动填充列，最小200px，最大填满 */
    gap: 10px;

    .item {
        padding: 10px;
        background-color: #e0e0e0;
        text-align: center;
    }
}

.components {
    width: 80%;
    height: auto;
    padding: 10px;
    border: 1px solid red;
    box-shadow: 10px 10px 10px #e0e0e0;
    margin: 0 auto;
}
</style>