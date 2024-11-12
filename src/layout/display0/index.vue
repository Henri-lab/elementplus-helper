<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <RouterView name="header"></RouterView>
            </el-header>
            <el-container>
                <el-aside>
                    <RouterView name="aside"></RouterView>
                </el-aside>
                <el-container>
                    <el-main>
                        <RouterView name="main"></RouterView>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>


<style lang="scss" scoped>
.common-layout {
    @include common-layout-display0;
}
</style>