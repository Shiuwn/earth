import {createNameTag} from './tag.js'
import { lon2xyz } from '@/utils'
import config from '../config'
export default (scene)=>{
    var loader = new THREE.FileLoader()
    loader.setResponseType('json')
    loader.load('/assets/data/country-info.json', function (world) {
        world.forEach(country => {
            console.log(country);
            let tag = createNameTag()
            tag.setText(country.name)
            let {x,y,z} = lon2xyz(config.R, country.lat, country.lon)
            tag.position.set(x,y,z)
            scene.add(tag)
        });
    })
   
    
}