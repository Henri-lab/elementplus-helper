<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <RouterView name="header"></RouterView>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <RouterView name="aside"></RouterView>
                </el-aside>
                <el-container>
                    <el-main>
                        <RouterView name="main"></RouterView>
                    </el-main>
                    <el-footer>
                        <RouterView name="footer"></RouterView>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>