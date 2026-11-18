// Reconstructed from 180c0fplvd4t3.pretty.js, module 155415.
// deps: m743300, m67874, m608532, m715760, m64805, m871813, m878984, m792868, m534947, m283990
// exports: runChatTurn
export { x as "runChatTurn" };

"use strict";
    var t = m743300,
      n = m67874,
      r = m608532,
      a = m715760,
      i = m64805,
      l = m871813,
      s = m878984,
      o = m792868,
      c = m534947,
      u = m283990;
    let d = new Set([
        "editContext",
        "question",
        "questionRange",
        "examMarkdown",
        "examForSolving",
        "solutionPart",
        "search",
        "reference",
        "lines",
        "selection",
      ]),
      h = new Set(["none", "partial", "full"]);
    function m(e, t, n, r = !1) {
      let a = [],
        i = e?.some((e) => "ocr" === e || "chat" === e) ?? !1;
      return (
        t > 0
          ? (a.push("ocr"),
            (r || e?.includes("chat") || (!i && !n)) && a.push("chat"))
          : a.push("chat"),
        a
      );
    }
    function p(e) {
      let t = e.images?.length ?? 0;
      return t > 0 ? t : (e.extracted?.imageCount ?? 0);
    }
    async function f(e, n, r) {
      let s = await (0, a.postJsonStream)(
          "/api/chat-exam/plan",
          {
            message: e.message,
            files: (0, i.chatFilesPayload)(e.files),
            libraryIds: e.libraryIds?.length ? e.libraryIds : void 0,
            requireApproval: e.requireApproval ?? !0,
            uiActions: (0, c.uiActionCatalog)(e.uiActions ?? []),
            reasoning: e.reasoning,
            plannerHistory: e.plannerHistory ?? [],
            functions:
              n.exam.blockCount > 0 ||
              e.selection?.trim() ||
              e.references?.length
                ? [...t.EXAM_FUNCTION_SPECS]
                : [],
            references: (0, l.referencesPayload)(
              e.references?.filter((t) => e.newReferenceIds?.includes(t.id)),
            ),
            exam: n.exam,
            noteIndex: [],
            selection: e.selection ?? "",
            imageCount: p(e),
            images: e.images?.map((e) => ({
              data: e.data,
              mimeType: e.mimeType,
            })),
            extractedExam: e.extracted?.exam,
            imageAnalysis: e.extracted?.analysis,
            ocrWarnings: e.extracted?.warnings,
            ocrModel: e.extracted?.model,
            ocrImageCount: e.extracted?.imageCount,
            clarificationAnswers: e.clarificationAnswers,
          },
          r,
        ),
        o = "ui_action" === s.taskKind || "direct_reply" === s.taskKind;
      if (
        o &&
        "proceed" === s.decision &&
        (s.templatePrompt?.trim() || s.operations?.length || s.agents?.length)
      )
        throw Error(
          "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
        );
      let u =
        "proceed" !== s.decision || o
          ? []
          : m(s.operations, p(e), !e.message.trim(), !!e.files?.length);
      if (
        "proceed" === s.decision &&
        u.includes("chat") &&
        !s.templatePrompt?.trim()
      )
        throw Error("Bước lập kế hoạch không trả về lời nhắc nào.");
      let d = s.contextCompacted
          ? (s.compactedHistory ?? [])
          : (e.plannerHistory ?? []),
        h =
          s.plannerInput && s.plannerReply
            ? [
                ...d,
                { role: "user", content: s.plannerInput },
                { role: "assistant", content: s.plannerReply },
              ]
            : d;
      return { ...s, operations: u, nextPlannerHistory: h };
    }
    async function g(e, t, n) {
      let r = await (0, a.postJsonStream)(
        "/api/chat-exam",
        {
          messages: [{ role: "user", content: e.message }],
          files: (0, i.chatFilesPayload)(e.files),
          libraryIds: e.libraryIds?.length ? e.libraryIds : void 0,
          currentExam: t.includeExam ? e.exam : void 0,
          examTitle:
            "current_exam" === t.contextSource || "both" === t.contextSource
              ? e.exam?.title
              : void 0,
          contextSource: t.contextSource,
          intent: t.intent,
          editRanges: t.editRanges,
          prompt: t.prompt,
          verificationToken: t.verificationToken,
          resolvedContext: t.resolvedContext,
          planned: t.planned ?? !1,
          reasoning: e.reasoning,
          agents: t.agents,
          contextNotes: t.contextNotes,
          images: t.extracted
            ? void 0
            : e.images?.map((e) => ({ data: e.data, mimeType: e.mimeType })),
          extractedExam: t.extracted?.exam,
          imageAnalysis: t.extracted?.analysis,
          ocrModel: t.extracted?.model,
          ocrImageCount: t.extracted?.imageCount,
          knowledgeRefs: t.knowledgeRefs,
          instructionRefs: t.instructionRefs,
          operations: t.operations,
        },
        n,
      );
      if ("replace" === r.action && !r.exam?.content?.trim())
        throw new a.ApiError(
          "AI trả về một đề không có nội dung nên hệ thống đã không áp dụng.",
          { status: 502, code: "empty_generated_exam", stage: "chat_parse" },
        );
      if ("append" === r.action && !r.content?.trim())
        throw new a.ApiError(
          "AI yêu cầu chèn nội dung nhưng không trả về gì.",
          { status: 502, code: "empty_generated_content", stage: "chat_parse" },
        );
      return r;
    }
    async function x(e, t = {}) {
      
      let l,
        {
          onStage: b,
          onPlannerHistory: v,
          onProgress: y,
          onDelta: w,
          onReset: k,
          ...j
        } = t,
        C = { ...j, aiTurnId: crypto.randomUUID() },
        N = { exam: e.exam, selection: e.selection, references: e.references },
        S = (0, s.buildContextIndex)(e.exam, e.notes),
        M = null,
        R = !!e.images?.length,
        I = p(e) > 0;
      (!e.skipPlanning || I) &&
        (b?.(R ? "ocr" : "plan"),
        ("ui_action" !==
          (M = await f(e, S, {
            ...C,
            onProgress: ({ stage: e, message: t }) => {
              (b?.("ocr" === e ? "ocr" : "plan"), y?.(t));
            },
          })).taskKind ||
          "proceed" !== M.decision) &&
          v?.(M.nextPlannerHistory));
      let A = e.extracted ?? null;
      if (
        (M?.extractedExam &&
          (A = {
            exam: M.extractedExam,
            sourceImages: R ? e.images : e.extracted?.sourceImages,
            analysis: M.imageAnalysis ?? {
              documentType: "exam",
              subject: "",
              grade: "",
              examType: "",
              summary: `T\xe0i liệu OCR “${M.extractedExam.title}”, gồm ${M.extractedExam.content.length} k\xfd tự.`,
            },
            warnings: M.ocrWarnings ?? [],
            model: M.ocrModel,
            imageCount: p(e),
          }),
        I && !A && M?.decision !== "reject")
      )
        throw new a.ApiError(
          "API phân tích không trả về đề đã OCR nên đã dừng trước bước tạo đề.",
          { status: 502, code: "plan_missing_ocr", stage: "planner" },
        );
      if (!M) {
        let t = ["chat"];
        b?.("solve");
        let n = await g(
          e,
          {
            includeExam: !0,
            contextSource: "current_exam",
            contextNotes: [],
            operations: t,
            extracted: null,
          },
          {
            ...C,
            onProgress: ({ message: e }) => y?.(e),
            onDelta: w,
            onReset: k,
          },
        );
        return {
          reply: n.reply,
          action: n.action,
          chooseApply: n.chooseApply,
          rejected: !1,
          exam: n.exam,
          content: n.content,
          summary: n.summary ?? "",
          warnings: n.warnings ?? [],
          grounding: n.grounding,
          trace: {
            contextSource: n.contextSource ?? "current_exam",
            templatePrompt: "",
            resolvedPrompt: e.message,
            decision: "proceed",
            intent: "advice",
            operations: t,
            reasoning: e.reasoning,
            agents: [],
            agentRuns: n.agents ?? [],
            plannerContextCompacted: !1,
            plannerCachedTokens: 0,
            examScope: "full",
            examForced: !0,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
            noteIndex: [],
            noteRefs: [],
            knowledgeRefs: [],
            imageCount: 0,
            solverModel: n.model,
            fellBack: !0,
          },
        };
      }
      let T = I
          ? "current_exam" === M.contextSource || "both" === M.contextSource
            ? M.contextSource
            : "images"
          : "none" === M.contextSource
            ? "none"
            : "current_exam",
        E = "current_exam" === T || "both" === T,
        P = "images" !== T && Array.isArray(M.noteRefs) ? M.noteRefs : [],
        $ = Array.isArray(M.knowledgeRefs) ? M.knowledgeRefs : [],
        _ = Array.isArray(M.agents) ? M.agents : [],
        q =
          "proceed" !== M.decision ||
          "ui_action" === M.taskKind ||
          "direct_reply" === M.taskKind
            ? []
            : m(M.operations, p(e), !e.message.trim(), !!e.files?.length),
        z = E ? ((i = M.examScope) && h.has(i) ? i : "partial") : "none",
        D = {
          taskKind: M.taskKind,
          uiCalls: M.uiCalls ?? [],
          contextSource: T,
          templatePrompt: M.templatePrompt ?? "",
          decision: M.decision,
          intent: M.intent,
          operations: q,
          reasoning: e.reasoning,
          suggestedReasoning: (0, r.isReasoningLevel)(M.suggestedReasoning)
            ? M.suggestedReasoning
            : r.DEFAULT_REASONING,
          agents: _,
          agentRuns: [],
          plannerContextCompacted: !!M.contextCompacted,
          plannerCachedTokens: M.usage?.cachedContentTokenCount ?? 0,
          noteIndex: [],
          noteRefs: P,
          knowledgeRefs: $,
          imageCount: p(e),
          plannerModel: M.model,
          ocrModel: A?.model,
          imageAnalysis: A?.analysis,
          fellBack: !1,
        };
      if ("clarify" === M.decision) {
        let e = M.clarifications ?? [],
          t = M.reply?.trim() ?? "";
        if ((0 === e.length && !t) || e.some((e) => e.options.length < 2))
          throw new a.ApiError(
            "Agent điều phối chưa gửi câu hỏi làm rõ hợp lệ.",
            {
              status: 502,
              code: "plan_invalid_clarification",
              stage: "planner_parse",
            },
          );
        return {
          reply: 1 === e.length && "confirm" === e[0].kind ? "" : t,
          action: "none",
          rejected: !1,
          clarifications: e,
          clarificationContext: A ?? void 0,
          summary: "",
          planSummary: M.summary,
          notes: M.notes,
          warnings: A?.warnings ?? [],
          trace: {
            ...D,
            resolvedPrompt: "",
            examScope: "none",
            examForced: !1,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
          },
        };
      }
      if ("reject" === M.decision)
        return {
          reply:
            M.reply?.trim() ||
            "Tôi chỉ hỗ trợ các việc liên quan tới soạn và sửa đề thi.",
          action: "none",
          rejected: !0,
          summary: "",
          planSummary: M.summary,
          notes: M.notes,
          warnings: A?.warnings ?? [],
          trace: {
            ...D,
            resolvedPrompt: "",
            examScope: "none",
            examForced: !1,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
          },
        };
      if ("ui_action" === M.taskKind || "direct_reply" === M.taskKind) {
        if (
          M.templatePrompt?.trim() ||
          M.agents?.length ||
          M.operations?.length
        )
          throw Error(
            "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
          );
        let t = M.uiCalls ?? [];
        if ("ui_action" === M.taskKind)
          ((0, c.executeUICalls)(t, e.uiActions ?? [], C.signal),
            v?.(M.nextPlannerHistory));
        else if (t.length || !M.reply?.trim())
          throw Error("Phản hồi trực tiếp của trợ lý không hợp lệ.");
        return {
          reply: M.reply?.trim() || "Đã thực hiện thao tác giao diện.",
          action: "none",
          rejected: !1,
          summary: M.summary,
          planSummary: M.summary,
          notes: M.notes,
          warnings: A?.warnings ?? [],
          trace: {
            ...D,
            contextSource: "none",
            resolvedPrompt: "",
            examScope: "none",
            examForced: !1,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
          },
        };
      }
      if (M.uiCalls?.length)
        throw Error(
          "Kế hoạch trộn thao tác giao diện với soạn đề chưa được hỗ trợ.",
        );
      let O = M.templatePrompt ?? "",
        L =
          !E && /\{\{[^{}]+\}\}/.test(O)
            ? `Thực hiện y\xeau cầu sau tr\xean ExamDocument OCR của ảnh mới, kh\xf4ng d\xf9ng đề tr\xean UI: ${e.message}`
            : O,
        F = E
          ? (0, n.resolvePlaceholders)(L, N)
          : { prompt: L, resolved: [], unknown: [], injectedChars: 0 };
      if (F.resolved.some((e) => !e.ok))
        throw new a.ApiError(
          "Không đọc được ngữ cảnh mà kế hoạch yêu cầu. Hãy chọn lại câu hoặc gửi lại yêu cầu.",
          { status: 0, code: "context_resolution_failed", stage: "context" },
        );
      let H = F.resolved.some((e) => e.ok && "examMarkdown" === e.name),
        B = F.resolved
          .filter((e) => e.ok && "editContext" === e.name)
          .map((e) => ({ from: Number(e.args[0]), to: Number(e.args[1]) })),
        K = E && "edit" === M.intent && B.length > 0;
      if (
        B.length > 0 &&
        (!K ||
          H ||
          B.length > 24 ||
          B.some((e) => !(0, u.validEditRange)(e, S.exam.blockCount)))
      )
        throw new a.ApiError(
          "Kế hoạch trả về phạm vi chỉnh sửa không hợp lệ.",
          { status: 0, code: "invalid_edit_range", stage: "context" },
        );
      let V = F.resolved.some((e) => e.ok && d.has(e.name)),
        U = ("solve" === M.intent || "rubric" === M.intent) && !V,
        G =
          E &&
          !H &&
          !K &&
          ("full" === z ||
            U ||
            ("edit" === M.intent && !!e.exam.content.trim())) &&
          !!(e.exam.content.trim() || "full" === z);
      q.includes("chat") && b?.("solve");
      let X = await g(
        e,
        {
          prompt: F.prompt,
          verificationToken: M.verificationToken,
          instructionRefs: M.instructionRefs,
          resolvedContext: M.verificationToken
            ? F.resolved.map(({ raw: e, value: t }) => ({ raw: e, value: t }))
            : void 0,
          planned: !0,
          includeExam: E && G,
          contextSource: T,
          intent: M.intent,
          editRanges: K ? B : void 0,
          contextNotes: [],
          knowledgeRefs: $,
          agents: _,
          operations: q,
          extracted: A,
        },
        {
          ...C,
          onProgress: ({ message: e }) => y?.(e),
          onDelta: K ? void 0 : w,
          onReset: K ? void 0 : k,
        },
      );
      if (K && "patch" !== X.action && "none" !== X.action)
        throw new a.ApiError(
          "AI chưa trả về chỉnh sửa từng đoạn hợp lệ nên chưa áp dụng vào đề.",
          { status: 502, code: "invalid_exam_patch", stage: "chat_parse" },
        );
      if ("patch" === X.action) {
        if (!K)
          throw new a.ApiError(
            "AI trả về chỉnh sửa không có phạm vi được chọn.",
            { status: 502, code: "invalid_exam_patch", stage: "chat_parse" },
          );
        l = (0, u.applyExamPatches)(e.exam, X.patches ?? [], B);
      }
      let Q = l ?? X.exam,
        W = A?.sourceImages ?? e.images ?? [],
        J = Q ? await (0, o.resolveOcrFigureCrops)(Q.content, W) : void 0,
        Y = X.content
          ? await (0, o.resolveOcrFigureCrops)(X.content, W)
          : void 0;
      return {
        reply: X.reply,
        action: X.action,
        chooseApply: X.chooseApply,
        rejected: !1,
        exam: Q && J ? { ...Q, content: J.content } : Q,
        patches: X.patches,
        editRanges: K ? B : void 0,
        content: Y?.content ?? X.content,
        summary: X.summary ?? "",
        planSummary: M.summary,
        notes: M.notes,
        warnings: [
          ...(A?.warnings ?? []),
          ...(X.warnings ?? []),
          ...(J?.warnings ?? []),
          ...(Y?.warnings ?? []),
        ],
        grounding: X.grounding,
        trace: {
          ...D,
          reasoning: (0, r.isReasoningLevel)(X.reasoning ?? "")
            ? X.reasoning
            : e.reasoning,
          agentRuns: X.agents ?? [],
          resolvedPrompt: F.prompt,
          examScope: K ? "partial" : G ? "full" : z,
          examForced: G,
          placeholders: F.resolved,
          unknownFunctions: F.unknown,
          injectedChars: F.injectedChars,
          solverModel: q.includes("chat") ? X.model : void 0,
          ocrModel: A?.model ?? X.ocrModel,
        },
      };
    }
    (, );
