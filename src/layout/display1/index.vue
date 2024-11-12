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
                        <RouterView name="main_h" class="main_h"></RouterView>
                        <RouterView name="main_m" class="main_m"></RouterView>
                        <RouterView name="main_f" class="main_f"></RouterView>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>


<style lang="scss" scoped>
.common-layout {
    @include common-layout-display1;
}
</style>