package com.iwscream.springboot;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class DefaultView {
    @RequestMapping("/clubManager")
    public String index()  {
        return "forward:index.html";
    }
}
