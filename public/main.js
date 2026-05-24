const hero = document.querySelector("#hero");
    const root = document.documentElement;
    const revealEls = document.querySelectorAll(".reveal");
    const toast = document.querySelector("#toast");
    const bagCount = document.querySelector("#bagCount");
    const bagButton = document.querySelector("#bagButton");
    const totalPrice = document.querySelector("#totalPrice");
    const configNote = document.querySelector("#configNote");
    const buyProductImage = document.querySelector("#buyProductImage");
    const modal = document.querySelector("#purchaseModal");
    const modalConfig = document.querySelector("#modalConfig");
    const modalPrice = document.querySelector("#modalPrice");
    const storyProgress = document.querySelector("#storyProgress");
    const storySteps = document.querySelector("#storySteps");

    document.querySelectorAll(".hero .reveal").forEach((element) => {
      element.classList.add("is-visible");
    });

    const basePrice = 2999;
    let cartItems = 0;
    const selections = {
      color: { name: "曜石黑", price: 0, image: "assets/yono-product-obsidian.png" },
      lens: { name: "日常高清镜片", price: 0 },
      service: { name: "基础 AI 套装", price: 0 }
    };

    const featureData = {
      vision: {
        title: "多模态感知",
        copy: "摄像头、麦克风和运动状态共同理解你所处的环境。YONO 能识别眼前物体、文字与场景，并以轻提示方式给出建议。",
        stats: [
          ["视觉", "环境、文字、人物和物体识别"],
          ["语音", "降噪拾音与自然交互"],
          ["触控", "镜腿轻触即可确认操作"]
        ],
        mark: "navigation"
      },
      translate: {
        title: "实时翻译",
        copy: "外语对话、路牌和菜单可以在视线中被轻量翻译。YONO 让跨语言沟通少一点停顿，多一点自然。",
        stats: [
          ["多语言", "旅行与会议常用语境覆盖"],
          ["字幕", "贴近视线边缘，不遮挡主体"],
          ["离线", "基础词库可在弱网络下使用"]
        ],
        mark: "translate"
      },
      navigate: {
        title: "智能导航",
        copy: "方向、距离和路况提示直接出现在视野边缘。你可以保持抬头走路，把注意力留给真实环境。",
        stats: [
          ["方向", "转向提示提前出现"],
          ["安全", "减少低头查看手机"],
          ["城市", "步行、骑行和地铁衔接"]
        ],
        mark: "navigation"
      },
      assistant: {
        title: "AI 智能助手",
        copy: "日程提醒、信息查询、会议摘要和知识问答随时可用。YONO 像一位安静的助理，只在你需要时出现。",
        stats: [
          ["摘要", "会议重点自动整理"],
          ["查询", "语音提问，即时反馈"],
          ["同步", "结果可回到手机继续处理"]
        ],
        mark: "assistant"
      }
    };

    function formatPrice(value) {
      return "¥" + value.toLocaleString("zh-CN");
    }

    function currentTotal() {
      return basePrice + selections.color.price + selections.lens.price + selections.service.price;
    }

    function currentConfig() {
      return `${selections.color.name}，${selections.lens.name}，${selections.service.name}`;
    }

    function updateBuyProductImage() {
      if (!buyProductImage || !selections.color.image || buyProductImage.getAttribute("src") === selections.color.image) return;
      buyProductImage.classList.add("is-switching");
      window.setTimeout(() => {
        buyProductImage.onload = () => buyProductImage.classList.remove("is-switching");
        buyProductImage.alt = `正在配置的 YONO AI 智能眼镜：${selections.color.name}`;
        buyProductImage.src = selections.color.image;
        window.setTimeout(() => buyProductImage.classList.remove("is-switching"), 360);
      }, 120);
    }

    function updateSummary() {
      document.querySelector("#colorSummary").textContent = selections.color.name;
      document.querySelector("#lensSummary").textContent = selections.lens.name;
      document.querySelector("#serviceSummary").textContent = selections.service.name;
      totalPrice.textContent = formatPrice(currentTotal());
      configNote.textContent = `已选择：${currentConfig()}。`;
      modalConfig.textContent = currentConfig();
      modalPrice.textContent = formatPrice(currentTotal());
      updateBuyProductImage();
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");
      window.clearTimeout(showToast.timer);
      showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
    }

    function openModal() {
      updateSummary();
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }

    document.addEventListener("pointermove", (event) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      root.style.setProperty("--mx", x.toFixed(3));
      root.style.setProperty("--my", y.toFixed(3));
      root.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
      root.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
      root.style.setProperty("--gx", `${Math.round((event.clientX / window.innerWidth) * 100)}%`);
      root.style.setProperty("--gy", `${Math.round(((event.clientY - rect.top) / rect.height) * 100)}%`);
    });

    hero?.addEventListener("pointerleave", () => {
      root.style.setProperty("--mx", "0");
      root.style.setProperty("--my", "0");
      root.style.setProperty("--rx", "0deg");
      root.style.setProperty("--ry", "0deg");
      root.style.setProperty("--gx", "50%");
      root.style.setProperty("--gy", "50%");
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealEls.forEach((element) => revealObserver.observe(element));

    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.tab;
        const data = featureData[key];
        document.querySelectorAll(".tab-button").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-selected", item === button ? "true" : "false");
        });
        document.querySelector("#tabTitle").textContent = data.title;
        document.querySelector("#tabCopy").textContent = data.copy;
        document.querySelector("#tabStats").innerHTML = data.stats.map(([title, copy]) => (
          `<div class="panel-stat"><strong>${title}</strong><span>${copy}</span></div>`
        )).join("");
        document.querySelectorAll(".lens-mark").forEach((mark) => {
          mark.classList.toggle("active", mark.dataset.mark === data.mark);
        });
      });
    });

    const sceneTrack = document.querySelector("#sceneTrack");
    document.querySelector("#scenePrev").addEventListener("click", () => {
      sceneTrack.scrollBy({ left: -360, behavior: "smooth" });
    });
    document.querySelector("#sceneNext").addEventListener("click", () => {
      sceneTrack.scrollBy({ left: 360, behavior: "smooth" });
    });

    document.querySelectorAll("[data-option-group]").forEach((group) => {
      const groupName = group.dataset.optionGroup;
      group.querySelectorAll(".option").forEach((button) => {
        button.addEventListener("click", () => {
          group.querySelectorAll(".option").forEach((item) => item.classList.remove("active"));
          button.classList.add("active");
          selections[groupName] = {
            name: button.dataset.name,
            price: Number(button.dataset.price),
            image: button.dataset.image
          };
          updateSummary();
        });
      });
    });

    document.querySelectorAll('[data-option-group="color"] .option[data-image]').forEach((button) => {
      const preload = new Image();
      preload.src = button.dataset.image;
    });

    document.querySelector("#addToCart").addEventListener("click", () => {
      cartItems += 1;
      bagCount.textContent = String(cartItems);
      showToast(`已加入购物车：${currentConfig()}，${formatPrice(currentTotal())}`);
    });

    document.querySelector("#buyNow").addEventListener("click", openModal);
    document.querySelector("#closeModal").addEventListener("click", closeModal);
    document.querySelector("#cancelPurchase").addEventListener("click", closeModal);
    document.querySelector("#confirmPurchase").addEventListener("click", () => {
      closeModal();
      showToast("模拟购买成功。YONO 将继续懂你所想。");
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("show")) closeModal();
    });
    bagButton.addEventListener("click", () => {
      const message = cartItems > 0 ? `购物车中有 ${cartItems} 件 YONO 产品。` : "购物车还是空的，可以先选择一副 YONO。";
      showToast(message);
    });

    function updateStoryProgress() {
      if (!storySteps || !storyProgress) return;
      const rect = storySteps.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height + viewport;
      const passed = viewport - rect.top;
      const progress = Math.max(0, Math.min(1, passed / total));
      storyProgress.style.width = `${Math.round(progress * 100)}%`;
    }

    window.addEventListener("scroll", updateStoryProgress, { passive: true });
    window.addEventListener("resize", updateStoryProgress);
    window.addEventListener("load", () => {
      if (window.location.hash) {
        document.querySelector(window.location.hash)?.scrollIntoView();
      }
    });
    updateSummary();
    updateStoryProgress();
  