<template>
<div>
    {{ name }}
</div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { onBeforeMount } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
export default {
    name:"SearchMovie",

    setup( ) {
        let name = ref("")

        const route = useRoute( )

        onBeforeMount( ( ) =>{
            name.value = route.params.name
        })

        return{  

            name
        }
    }

}
</script>

<style>

</style>